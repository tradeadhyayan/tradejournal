const pasteRaw = "2026-01-25,NIFTY,BUY,24500,24550,1,24400,INDEX,BREAKOUT,Strong trend";

const lines = pasteRaw.trim().split('\n');
const preview = lines.map(line => {
    let parts = line.split(/[\t,]/).map(p => p.trim());
    if (parts.length < 5) {
        parts = line.trim().split(/\s{2,}/).map(p => p.trim());
        if (parts.length < 5) {
            parts = line.trim().split(/\s+/).map(p => p.trim());
        }
    }

    if (parts.length < 5) return null;

    const slValue = parseFloat(parts[6] || '');
    const rawAsset = (parts[7] || 'INDEX').toUpperCase();
    const strategy = (parts[8] || 'UNDEFINED').toUpperCase();
    const notes = parts[9] || '';

    return {
        date: parts[0],
        instrument: parts[1],
        direction: parts[2],
        entry: parts[3],
        exit: parts[4],
        qty: parseFloat(parts[5] || '1'),
        sl: isNaN(slValue) ? 0 : slValue,
        asset: rawAsset,
        strategy: strategy,
        notes: notes,
        is_sl_missing: isNaN(slValue) || slValue === 0
    };
}).filter(Boolean);

console.log(JSON.stringify(preview, null, 2));
