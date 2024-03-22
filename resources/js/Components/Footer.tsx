export default function Footer () {
    return (
        <div className='h-[90px] bg-[#16628E] bottom-0 w-full text-slate-100 flex items-center justify-center'>
            <div className='flex flex-col items-center'>
                <div className='font-bold'>© 3C Solution do Brasil - {new Date().getFullYear()}</div>
                <div className='flex'>Desenvolvido por <a className='ml-1' target='_blank' href='https://almeidiano.dev/'><img src='/main-logo.svg' height='23' width='23' /></a></div>
            </div>
        </div>
    )
}
