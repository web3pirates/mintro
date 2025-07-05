import axios from 'axios';

const NOVES_API_KEY = process.env.NOVES_API_KEY!;


export async function decodeTxWithNoves(txHash: string) {
  try {
    const response = await axios.get(
      `https://translate.noves.fi/evm/worldchain/tx/${txHash}?v5Format=false`,
      {
        headers: {
          Apikey: `${NOVES_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data || null;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`❌ Noves API error for ${txHash}:`, err.message);
    } else {
      console.error(`❌ Noves API error for ${txHash}:`, err);
    }
    return null;
  }
}
