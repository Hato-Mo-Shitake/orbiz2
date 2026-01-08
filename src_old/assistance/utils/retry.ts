export async function retry<T>(
    action: () => Promise<T>,               // 実行する処理（非同期）
    isSuccess: (result: T | null) => boolean,      // 成否判定関数
    maxAttempts = 3,                        // 最大試行回数
    delayMs = 700                          // 各リトライ間隔(ms)
): Promise<T | null> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const result = await action();

            if (isSuccess(result)) {
                console.log(`✅ 成功: ${attempt}回目で成功`);
                return result;
            }

            console.warn(`⚠️ ${attempt}回目の試行は失敗 (結果: ${JSON.stringify(result)})`);

        } catch (error) {
            console.error(`💥 ${attempt}回目の試行で例外発生`, error);
        }

        if (attempt < maxAttempts) {
            console.log(`⏳ ${delayMs}ms 待機して再試行...`);
            await new Promise(res => setTimeout(res, delayMs));
        }
    }

    console.error("❌ 最大リトライ回数に達しました。処理失敗。");
    return null;
}