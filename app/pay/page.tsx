"use client";
import React, { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { GoogleMap, DistanceMatrixService } from "@react-google-maps/api";
import LocationSearchInput from './LocationSearch';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

//import DistanceMatrixService from './DistanceMatrixService';

interface MapComponentProps { }

const MapComponent: React.FC<MapComponentProps> = () => {

    const router = useRouter();
    const [origin, setOrigin] = useState<string>('');
    const [destination, setDestination] = useState<string>('');
    const [distance, setDistance] = useState<number>(0);
    const [selectedQuatity, setSelectedQuantity] = useState(0);
    const [isButtonDisable, setIsButtonDisable] = useState(true);
    const [price, setPrice] = useState(0.0);
    var pricePerKilometer = 1.15;
    //price kilometer > 4 = 1.6

    function minprice(num: string): string {
        var realnum = parseFloat(num);
        if (realnum < 32.00) {
            return "32"
        } else {
            return num
        }

    }


    function calculatePricePerson(numPassengers: number): number {
        const basePriceUpTo5 = 7;
        const basePriceUpTo10 = 12;
        const basePriceUpTo12 = 19;
        var mult = 0.86

        const pricePerPassenger = 10; // Assuming 10€ for each additional passenger beyond 8
        var num = 0;
        if (numPassengers <= 4) {
            pricePerKilometer = 1.2;
            num = basePriceUpTo5;
        } else if (numPassengers <= 8) {
            pricePerKilometer = 1.7;
            num = basePriceUpTo10;
        } else if (numPassengers <= 12) {
            num = basePriceUpTo12
            pricePerKilometer = 2.8;
        } else {
            num = 20
            pricePerKilometer = 3.4
            //num = basePriceUpTo10 + pricePerPassenger * (numPassengers - 8);
        }
        //pricePerKilometer = pricePerKilometer * mult
        var checkifmin = num + (distance / 1000) * pricePerKilometer
        if (checkifmin < 32) {
            return 32
        } else {
            return checkifmin
        }

    }
    function DistanceMatrix() {
        var service = new google.maps.DistanceMatrixService();
        if (origin != '' && destination != '' && selectedQuatity != 0) {

            service.getDistanceMatrix({
                avoidTolls: true,
                destinations: [origin],
                origins: [destination],
                travelMode: 'DRIVING',

            },
                callback)

            setPrice(calculatePricePerson(selectedQuatity));
        }
    }

    function callback(response: google.maps.DistanceMatrixResponse, status: google.maps.DistanceMatrixStatus) {
        setDistance(response.rows[0].elements[0].distance.value);
        console.log(response.rows[0].elements[0].distance)


    }

    function OptionsWithNumbers({ maxPassengers, labelText }: any) {

        var options = [<option defaultValue={"--"} >--</option>];
        for (var i = 1; i <= Number(maxPassengers); i++)
            options.push(<option key={i}>{i}</option>);


        return <div className="py-6">
            <label className='text-2xl font-semibold' > {labelText} </label>
            <select className="select bg-blueLight rounded w-full font-medium mt-2"
                value={selectedQuatity}
                onChange={e => {
                    var value = parseFloat(e.target.value);

                    if (isNaN(value)) {
                        setIsButtonDisable(true);
                        setPrice(0);
                        setSelectedQuantity(0);
                    }
                    else {
                        setIsButtonDisable(false);
                        setPrice(calculatePricePerson(Number(e.target.value)));
                        setSelectedQuantity(Number(e.target.value));
                    }
                }
                }>
                {options}
            </select>
        </div>
    }
    const secretKey = process.env.GOOGLE_SECRET_KEY;
    const scriptText: string = "https://maps.googleapis.com/maps/api/js?key=" + secretKey + "&libraries=places"

    return (
        <div className='justify-center items-center flex-col m-5'>
            <script src={scriptText}></script>
            <h1>Effortlessly plan your journeys and we will create a seamless and cost-effective transfer experience.</h1>
            <div className=''>
                <LocationSearchInput label={"From :"} placeHolder={"Type your address or location "} onSelectAddress={(address: string) => { setOrigin(address); DistanceMatrix() }} onChangeAddress={(address: string) => DistanceMatrix} />

            </div>
            <LocationSearchInput label={"To :"} placeHolder={"Type your address or location "} onSelectAddress={(address: string) => { setDestination(address); DistanceMatrix() }} onChangeAddress={(address: string) => DistanceMatrix} />

            <OptionsWithNumbers maxPassengers={16} labelText='Quantity of passengers:'></OptionsWithNumbers>
            <div className="flex-none text-center mt-5">
                <text className='text-3xl font-semibold'>Price: {price.toFixed(2)}€</text>
            </div>
            <Link
                href={{
                    pathname: '/checkout',
                    query: {
                        origin: origin,
                        destination: destination,
                        price: price
                    }
                }}
            >
                Go to another page
            </Link>
        </div>
    );
};

export default MapComponent;
