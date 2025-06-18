"use client"

import { Input } from '@/components/ui/input'
import { AddressSearchAutoComplete } from '@/lib/actions/nap.actions';
import { useMutation } from '@tanstack/react-query';
import { LoaderCircleIcon, MapPinIcon, SearchIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce';

export default function AddressSearch({ selectedAddress, setSelectedAddress, appendFormValue }: { selectedAddress: string, setSelectedAddress: (address: string) => void, appendFormValue: (selectedAddress: string, placeId: string) => void }) {
    const [input, setInput] = useState('');
    const [debouncedInput] = useDebounce(input, 300);

    const { status, data: addressResult, mutate: serachForAddress } = useMutation({
        mutationFn: async ({ address }: { address: string }) => {
            const result = await AddressSearchAutoComplete({ address });
            return result[0];
        },
    });





    useEffect(() => {
        if (debouncedInput && !selectedAddress) {
            serachForAddress({ address: debouncedInput });
        }
    }, [debouncedInput, serachForAddress, selectedAddress]);

    return (
        <div className="relative w-full">
            <div className="relative flex items-center w-full">
                <Input
                    className="pl-12"
                    type="text"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value)
                        setSelectedAddress("")
                    }}
                    placeholder="Search..."
                />
                {status === "pending" ? (
                    <LoaderCircleIcon className="absolute left-2 animate-spin stroke-muted-foreground" />
                ) : (
                    <SearchIcon className="stroke-muted-foreground absolute left-3" />
                )}
            </div>

            <div
                className="bg-background border border-t-0 rounded-md rounded-t-none border-input top-full absolute w-full z-10"
            >
                {!selectedAddress && addressResult && addressResult.length > 0 && addressResult.map((result, index) => (
                    <div
                        className={`hover:cursor-pointer hover:bg-muted ${addressResult.length - 1 !== index && "border-b"} p-2`}
                        key={index}
                        onClick={() => {
                            console.log("Selected address:", result.placePrediction?.text?.text);
                            setInput(result.placePrediction?.text?.text || "");
                            setSelectedAddress(result.placePrediction?.text?.text || "");

                            appendFormValue(result.placePrediction?.placeId, result.placePrediction?.text?.text || "");
                        }}

                    >
                        <div className="flex justify-between">
                            <p className="text-sm font-semibold ">
                                {result.placePrediction?.text?.text}
                            </p>
                            <MapPinIcon />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
