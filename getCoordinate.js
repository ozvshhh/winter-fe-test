/**
 * 최대한 "새 위치"를 받도록 유도하는 좌표 획득 함수
 * - maximumAge: 0 (캐시 금지)
 * - watchPosition으로 연속 샘플링해서 best(최고 정확도) 선택
 * - 목표 정확도(targetAccuracy) 달성 못하면 재시도 루프(retry) 수행
 *
 * 반환: { latitude, longitude, accuracy, timestamp, raw }
 */
export async function getCoordinate({
  targetAccuracy = 20,     // m, 이 값 이하가 나오면 즉시 성공 처리
  sampleWaitMs = 10_000,   // 한 번의 watch 샘플링을 돌릴 최대 시간
  retry = 2,               // 실패/미달 시 추가 재시도 횟수 (총 시도 = 1 + retry)
  retryDelayMs = 800,      // 재시도 사이 텀
  timeoutMs = 20_000,      // getCurrentPosition류 내부 timeout 느낌 (watch에서도 간접 적용)
  enableHighAccuracy = true,
  debug = false,
} = {}) {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let log_data = [];
  if (!("geolocation" in navigator)) {
    throw new Error("이 브라우저는 Geolocation을 지원하지 않음");
  }

  // watchPosition으로 sampleWaitMs 동안 샘플링해서 best를 고르는 1회 시도
  const sampleOnce = () =>
    new Promise((resolve, reject) => {
      let best = null;
      let done = false;

      const finish = (result, err) => {
        if (done) return;
        done = true;
        if (watchId != null) navigator.geolocation.clearWatch(watchId);
        if (timerId != null) clearTimeout(timerId);
        if (err) reject(err);
        else resolve(result);
      };

      const options = {
        enableHighAccuracy,
        maximumAge: 0,      // ✅ 캐시 사용 금지 (가능한 한 새 측정 유도)
        timeout: timeoutMs, // (watchPosition에서 브라우저가 무시할 수도 있지만 넣어둠)
      };

      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;

        log_data.push(`{lat: ${latitude} long: ${longitude} acc: ${accuracy}}`);
          // best 갱신: accuracy가 더 작은(더 정확한) 값을 채택
          if (!best || accuracy < best.coords.accuracy) best = pos;

          if (debug) {
            console.log(
              `[geo] lat=${latitude}, lng=${longitude}, acc=${accuracy}m, best=${best?.coords?.accuracy}m`
            );
          }

          // 🎯 목표 정확도 달성 시 즉시 종료
          if (accuracy <= targetAccuracy) {
            finish(best);
          }
        },
        (err) => {
          // watchPosition 자체가 실패하면 즉시 종료
          finish(null, err);
        },
        options
      );

      // ⏳ sampleWaitMs 동안 목표 달성 못하면 best를 반환(있으면) / 없으면 에러
      const timerId = setTimeout(() => {
        if (best) finish(best);
        else finish(null, new Error("위치 샘플을 못 받음"));
      }, sampleWaitMs);
    });

  // ✅ 재시도 루프: best가 너무 부정확하면 다시 샘플링
  let lastBest = null;

  for (let attempt = 0; attempt <= retry; attempt++) {
    if (debug) console.log(`[geo] attempt ${attempt + 1}/${retry + 1}`);

    try {
      const pos = await sampleOnce();
      lastBest = pos;

      const { latitude, longitude, accuracy } = pos.coords;

      // targetAccuracy 달성하면 바로 리턴
      console.log("log_data",log_data);
      if (accuracy <= targetAccuracy) {
        return {
          latitude,
          longitude,
          accuracy,
          timestamp: pos.timestamp,
          raw: pos,
          log_data,
        };
      }

      // 아직 부정확하면 재시도(남은 횟수 있으면)
      if (attempt < retry) {
        if (debug) console.log(`[geo] not enough accuracy (${accuracy}m). retrying...`);
        await sleep(retryDelayMs);
        continue;
      }

      // 재시도 다 써도 targetAccuracy 못맞추면 가장 좋은 값(lastBest) 리턴
      return {
        latitude,
        longitude,
        accuracy,
        timestamp: pos.timestamp,
        raw: pos,
        log_data,
      };
    } catch (e) {
      // 에러가 나도 재시도 기회가 있으면 다시
      if (attempt < retry) {
        if (debug) console.log(`[geo] error: ${e?.message ?? e}. retrying...`);
        await sleep(retryDelayMs);
        continue;
      }
      // 마지막 시도도 실패면, 혹시 lastBest가 있으면 그걸 주고, 없으면 throw
      if (lastBest) {
        const { latitude, longitude, accuracy } = lastBest.coords;
        return {
          latitude,
          longitude,
          accuracy,
          timestamp: lastBest.timestamp,
          raw: lastBest,
        };
      }
      throw e;
    }
  }

  // 여긴 논리상 도달하지 않음
  throw new Error("알 수 없는 오류");
}
