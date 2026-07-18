import { ChunkFlags } from "./ChunkFlags";

export class Chunk {
  static split(
    stream: Uint8Array,

    mtu: number,
  ) {
    const chunks: Uint8Array[] = [];

    for (let i = 0; i < stream.length; i += mtu) {
      chunks.push(
        stream.slice(
          i,

          i + mtu,
        ),
      );
    }

    return chunks;
  }

  static encode(
    stream: Uint8Array,

    mtu: number,
  ) {
    const chunks = this.split(
      stream,

      mtu,
    );

    return chunks.map((chunk, index) => {
      let flag = ChunkFlags.ICR[index % 4];

      if (index == 0) flag |= ChunkFlags.FIRST;

      if (index == chunks.length - 1) flag |= ChunkFlags.LAST;

      return new Uint8Array([flag, ...chunk]);
    });
  }
}
