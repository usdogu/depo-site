import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <title>Karışık Depo</title>
      </Head>
      <body class="bg-black">
        <Component />
      </body>
    </>
  );
}
