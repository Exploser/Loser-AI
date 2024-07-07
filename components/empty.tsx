import Image from "next/image";

interface EmptyProps {
    label: string;
}

const Empty = ( { label } :EmptyProps )  => {
    return (
        <div className='flex flex-col items-center justify-center h-full p-20'>
            <div className="relative h-72 w-72">
                <Image
                    alt="Empty"
                    fill
                    src='/empty.svg'
                />
            </div>
            <div className='text-lg font-semibold text-gray-400'>
                <p className="text-muted-foreground text-sm text-center"> {label} </p>
            </div>
        </div>
    )
}

export default Empty;