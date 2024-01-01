import Head from "next/head";
import Header from "~/components/common/Header";

export default function Home() {
  return (
    <>
      <Head>
        <title>Budget Breeze</title>
        <meta name="description" content="Budget Breeze" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <Header />
        <div className="mt-20">
          <h1 className="text-4xl font-bold text-center">Take your personal finances to the next level</h1>
          <br />
          <h1 className="text-4xl font-bold text-center">Your finance journey starts here</h1>
        </div>
      </main>
    </>
  );
};
