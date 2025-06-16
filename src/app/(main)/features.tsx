import React from 'react'
import { FeatureCard } from './feature-card'
import { features } from '@/constants/features'

export function Features() {
    return (
        <section className='min-h-screen flex flex-col gap-20 items-center'>
            <h2 className='text-8xl font-bold tracking-tighter '>Features</h2>
            <div className='grid grid-cols-2 gap-5'>
                {features.map((feature, index) => (
                    <FeatureCard
                        key={feature.title}
                        index={index}
                        title={feature.title}
                        description={feature.description}
                    />
                ))}
            </div>
        </section>
    )
}
