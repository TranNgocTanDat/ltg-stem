export class ChunkDecoder {

    private buffers: Uint8Array[] = [];

    add(chunk: Uint8Array) {

        // byte đầu là flag
        const payload = chunk.slice(1);

        this.buffers.push(payload);

        const flag = chunk[0];

        const isLast = (flag & 0x10) !== 0;

        if (!isLast) return null;

        const length = this.buffers.reduce(
            (a, b) => a + b.length,
            0,
        );

        const merged = new Uint8Array(length);

        let offset = 0;

        for (const part of this.buffers) {

            merged.set(part, offset);

            offset += part.length;

        }

        this.buffers = [];

        return merged;
    }

}