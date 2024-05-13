import Image from 'next/image';
import { UserEmailAuth } from '~/components/forms/user-email-auth';

export default function IndexPage() {
  return (
    <>
      <section className="space-y-10 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-20 overflow-hidden">
        <div className="container grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2">
          <div className="relative flex lg:min-w-[50rem] max-w-[70rem] flex-col gap-4 justify-center items-center lg:items-start">
            <Image
              src="/assets/Image.png"
              alt=""
              className="hidden absolute lg:block -z-50 -top-48 -left-40"
              draggable="false"
              width={750}
              height={750}
            />
            <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-primary">
              A budget that actually sticks
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-center lg:text-left">
              Keep it simple, save big! Effortless budgeting for powerful financial control. Start saving with ease!
            </p>
            <UserEmailAuth />
            <p className="text-xs text-muted-foreground">
              Create your account and start saving today!
            </p>
          </div>
          <div className='w-[70rem] md:translate-x-36 h-[500px]'>
            <Image
              src="/assets/test.png"
              alt=""
              className="border shadow-md rounded-lg"
              draggable="false"
              width={750}
              height={750}
            />
          </div>
        </div>
      </section>
      <section
        id="features"
        className="space-y-6 bg-slate-50 py-8 md:py-12 lg:py-24"
      >
        <div className="mx-auto mb-16 flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-2xl leading-[1.1] sm:text-2xl md:text-5xl text-primary">
            Everything you need to manage your finances
          </h2>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[260px] flex-col justify-between rounded-md p-6">
              <div className='flex items-center justify-center'>
                <Image
                  src="/assets/analysis.svg"
                  alt=""
                  draggable="false"
                  width={100}
                  height={100}
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">Analyse your spendings</h3>
                <p className="text-sm text-muted-foreground">
                  Analyse your spending habits and make better financial decisions.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[260px] flex-col justify-between rounded-md p-6">
              <div className='flex items-center justify-center'>
                <Image
                  src="/assets/savings.svg"
                  alt=""
                  draggable="false"
                  width={150}
                  height={150}
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">Control your savings</h3>
                <p className="text-sm text-muted-foreground">
                  Save money and reach your financial goals with ease.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[260px] flex-col justify-between rounded-md p-6">
              <div className='flex items-center justify-center'>
                <Image
                  src="/assets/budget.svg"
                  alt=""
                  draggable="false"
                  width={150}
                  height={150}
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">Define your budgets</h3>
                <p className="text-sm text-muted-foreground">
                  Set budgets and track your expenses to save more money.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
