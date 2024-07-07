import Image from 'next/image'

export const Loader = () => {
    return (
        <div className='h-full flex flex-col gap-y-4 items-center justify-center'>
            <div className="w-10 h-12 relative animate-spin">
                <Image
                    alt='logo'
                    fill
                    src='/logo.svg'
                />
            </div>
            <p className='text-muted-foreground text-sm'>Lemme think about that....</p>
        </div>
    )
}