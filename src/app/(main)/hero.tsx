import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <header className="h-screen flex justify-center pt-52">
            <div className="text-center flex flex-col gap-3">
                <div>
                    <h1 className="text-8xl font-bold tracking-tighter">Fix your business listings</h1>
                    <h2 className="text-8xl font-bold tracking-tighter text-primary">Boost Your Local Search</h2>
                </div>
                <div className="flex justify-center">
                    <p className="text-2xl max-w-4xl text-balance">Ensure your Name, Address, and Phone Number are consistent across Google, Yelp, Facebook, and more.
                        Get found by customers when it matters most.</p>
                </div>
                <div className="flex justify-center gap-2">
                    <Button size="lg">Get started</Button>
                    <Button variant="secondary" size="lg">View plans</Button>
                </div>
            </div>

        </header>
    )
}