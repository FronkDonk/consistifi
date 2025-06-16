import { Card, CardContent } from '@/components/ui/card'
import { AlertCircleIcon, GlobeIcon, ListCheckIcon, RadarIcon } from 'lucide-react'

const featureIcons = [
    { icon: <GlobeIcon /> },
    { icon: <AlertCircleIcon /> },
    { icon: <ListCheckIcon /> },
    { icon: <RadarIcon /> },
]

export function FeatureCard({ title, description, index }: { title: string, description: string, index: number }) {
    return (
        <Card className='flex flex-col gap-px max-w-lg w-full aspect-video'>
            <CardContent className='flex flex-col gap-5'>
                <div className='p-5 flex w-min  items-center bg-accent rounded-full '>
                    {featureIcons[index].icon}
                </div>
                <div>
                    <h4 className="text-2xl font-bold tracking-tight">{title}</h4>
                    <p className='text-muted-foreground max-w-sm'>{description}</p>
                </div>
            </CardContent>
        </Card>
    )
}
