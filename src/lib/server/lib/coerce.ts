/**
 * Coerce a raw weight value (string from Docker labels, number from YAML,
 * or undefined) into a valid finite number, falling back to the default.
 */
export function resolveNumberFromConfig(raw: unknown, fallback: number): number {
    if ((typeof raw === 'string' && raw.trim() === '') || raw === null) {
        return fallback;
    }
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
}
