export default function DesignSystemPage() {
  return (
    <div className='w-4/5 mx-auto my-10 p-6 border shadow-sm rounded min-h-screen'>
      <h1 className='font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl'>Heading 1</h1>
      <h2 className='font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl'>Heading 2</h2>
      <h3 className='font-heading text-xl sm:text-3xl md:text-4xl lg:text-5xl'>Heading 3</h3>
      <h4 className='font-heading text-lg sm:text-2xl md:text-3xl lg:text-4xl'>Heading 4</h4>
      <br />
      <p className='leading-normal sm:text-xl sm:leading-8'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam viverra posuere erat auctor suscipit. Etiam lacinia at velit id condimentum. Aliquam semper aliquam sem semper luctus. Nunc vel tortor elit. Pellentesque non consectetur neque. Phasellus gravida justo vel dolor ornare, eget congue purus pharetra. Donec sollicitudin vel nulla sit amet euismod. Quisque convallis in nisl eget pretium. Integer consectetur sagittis ligula at consectetur. Integer dapibus aliquet euismod. Nam a lectus vitae nisi semper sollicitudin et nec nisi. Quisque laoreet quis risus non hendrerit. Nunc auctor a justo in euismod. Donec sed rhoncus tortor. Fusce malesuada eros in consectetur tincidunt.</p>
      <br />
      <p className='leading-normal text-muted-foreground sm:text-xl sm:leading-8'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam viverra posuere erat auctor suscipit. Etiam lacinia at velit id condimentum. Aliquam semper aliquam sem semper luctus. Nunc vel tortor elit. Pellentesque non consectetur neque. Phasellus gravida justo vel dolor ornare, eget congue purus pharetra. Donec sollicitudin vel nulla sit amet euismod. Quisque convallis in nisl eget pretium. Integer consectetur sagittis ligula at consectetur. Integer dapibus aliquet euismod. Nam a lectus vitae nisi semper sollicitudin et nec nisi. Quisque laoreet quis risus non hendrerit. Nunc auctor a justo in euismod. Donec sed rhoncus tortor. Fusce malesuada eros in consectetur tincidunt.</p>
      <h4 className='font-heading text-lg sm:text-2xl md:text-3xl lg:text-4xl my-5'>Colors</h4>
      <div className='grid grid-flow-col auto-cols-max gap-3'>
        <div className='flex flex-col justify-center items-center gap-4'>
          <span className='bg-foreground p-3 rounded-lg border'>
            <span className='text-background'>Foreground</span>
          </span>
        </div>
        <div className='flex flex-col justify-center items-center gap-4'>
          <span className='bg-background p-3 rounded-lg border'>
            <span className='text-foreground'>Background</span>
          </span>
        </div>
        <div className='flex flex-col justify-center items-center gap-4'>
          <span className='bg-primary p-3 rounded-lg border'>
            <span className='text-primary-foreground'>Primary</span>
          </span>
        </div>
        <div className='flex flex-col justify-center items-center gap-4'>
          <span className='bg-secondary p-3 rounded-lg border'>
            <span className='text-secondary-foreground'>Secondary</span>
          </span>
        </div>
        <div className='flex flex-col justify-center items-center gap-4'>
          <span className='bg-accent p-3 rounded-lg border'>
            <span className='text-accent-foreground'>Accent</span>
          </span>
        </div>
        <div className='flex flex-col justify-center items-center gap-4'>
          <span className='bg-muted p-3 rounded-lg border'>
            <span className='text-muted-foreground'>Muted</span>
          </span>
        </div>
        <div className='flex flex-col justify-center items-center gap-4'>
          <span className='bg-destructive p-3 rounded-lg border'>
            <span className='text-destructive-foreground'>Destructive</span>
          </span>
        </div>
      </div>
      <h4 className='font-heading text-lg sm:text-2xl md:text-3xl lg:text-4xl my-5'>Buttons</h4>
    </div>
  );
}
