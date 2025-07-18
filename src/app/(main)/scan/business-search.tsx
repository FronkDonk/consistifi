"use client"

import { Input } from '@/components/ui/input'
import { BusinessSearchAutoComplete } from '@/lib/actions/nap.actions';
import { useMutation } from '@tanstack/react-query';
import { LoaderCircleIcon, MapPinIcon, SearchIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce';

export function BusinessSearch({ selectedBusiness, setSelectedBusiness, appendFormValue }: { selectedBusiness: string, setSelectedBusiness: (address: string) => void, appendFormValue: ({ selectedBusinessName, address, placeId }: { selectedBusinessName: string, address: string, placeId: string }) => void }) {
    const [input, setInput] = useState('');
    const [debouncedInput] = useDebounce(input, 300);

    const { status, data: addressResult, mutate: serachForAddress } = useMutation({
        mutationFn: async ({ businessName }: { businessName: string }) => {
            const result = await BusinessSearchAutoComplete({ businessName });
            return result[0];
        },
    });





    useEffect(() => {
        if (debouncedInput && !selectedBusiness) {
            serachForAddress({ businessName: debouncedInput });
        }
    }, [debouncedInput, serachForAddress, selectedBusiness]);

    return (
        <div className="relative w-full">
            <div className="relative flex items-center w-full">
                <Input
                    className="pl-12"
                    type="text"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value)
                        setSelectedBusiness("")
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
                {!selectedBusiness && addressResult && addressResult.length > 0 && addressResult.map((result, index) => (
                    <div
                        className={`hover:cursor-pointer hover:bg-muted ${addressResult.length - 1 !== index && "border-b"} p-2`}
                        key={index}
                        onClick={() => {
                            console.log("Selected address:", result.placePrediction?.text?.text);
                            setInput(result.placePrediction?.text?.text || "");
                            setSelectedBusiness(result.placePrediction?.text?.text || "");
                            console.log(result.placePrediction)

                            appendFormValue({ selectedBusinessName: result.placePrediction?.structuredFormat?.mainText?.text || "", address: result.placePrediction?.structuredFormat?.secondaryText?.text || "", placeId: result.placePrediction?.placeId || "" });
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
