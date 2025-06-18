import React from 'react'
import { TextHoverEffect } from './ui/text-hover-effect'
import { Button } from './ui/button'

export default function Footer() {
    return (
        <footer className='flex flex-col gap-20 rounded-4xl shadow-sm bg-card pt-40'>
            <div className='flex gap-5 justify-center'>
                <p className='font-semibold tracking-tight text-muted-foreground'>Product</p>
                <p className='font-semibold tracking-tight text-muted-foreground'>About us</p>
                <p className='font-semibold tracking-tight text-muted-foreground'>Pricing</p>
                <p className='font-semibold tracking-tight text-muted-foreground'>FAQ</p>
                <p className='font-semibold tracking-tight text-muted-foreground'>BLOG</p>
                <p className='font-semibold tracking-tight text-muted-foreground'>Privacy Policy</p>
                <p className='font-semibold tracking-tight text-muted-foreground'>Terms</p>
            </div>
            <div className=' w-full flex justify-center '>
                <TextHoverEffect text='CONSISTIFI' />
            </div>
        </footer>
    )
}
