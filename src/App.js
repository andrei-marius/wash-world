import logo from './logo.png';
import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Location from './components/location';
import Product from './components/product';

function App() {
    let [selectedLocation, setSelectedLocation] = useState('')
    let [estimatedDuration, setEstimatedDuration] = useState('')
    let [selectedProgram, setSelectedProgram] = useState('')
    let [selectedLocationId, setSelectedLocationId] = useState(null)
    let [locations, setLocations] = useState([])
    let [lpn, setLpn] = useState('')
    let [products, setProducts] = useState([])
    let [productsLoaded, setProductsLoaded] = useState(false)
    let [locationsLoaded, setLocationsLoaded] = useState(false)
    let [loading, setLoading] = useState(false)

    useEffect(() => {
        const getLocations = async () => {
            setLoading(true)
            try {
                const res = await axios('https://b46f027d-3a5f-4de6-9075-5e861759e531.mock.pstmn.io/locations')
                setLocations(res.data.response.locations)
                setLocationsLoaded(true);
            } catch(error){
                console.error(error.message)
            }
            setLoading(false)
        };
        getLocations()
    }, [])

    const getLpnAndProducts = async (id, name) => {
        setLoading(true)
        try {
            const res = await axios(`https://b46f027d-3a5f-4de6-9075-5e861759e531.mock.pstmn.io/cam/${id}`)
            const chars = res.data.response.lpn.slice(0, 2)
            const numbers = res.data.response.lpn.slice(2) - Math.round(Math.random() * 1)
            const newLpn = chars + numbers
            setLpn(newLpn)
            setSelectedLocationId(res.data.response.location)
            setSelectedLocation(name)

            if(res.status === 200){
                const res2 = await axios(`https://b46f027d-3a5f-4de6-9075-5e861759e531.mock.pstmn.io/products/${newLpn}`)
                setProducts(res2.data.response.products)
            }
        } catch(error){
            console.error(error.message)
        }
        setProductsLoaded(true)
        setLoading(false)
    }

    const post = async (program) => {
        setLoading(true)
        try {
            const res = await axios.post(`https://b46f027d-3a5f-4de6-9075-5e861759e531.mock.pstmn.io/${selectedLocationId}/start/${program}`)
            setSelectedProgram(res.data.response.program)
            setEstimatedDuration(res.data.response.estimated_duration)
        } catch(error){
            console.error(error.message)
        }
        setLoading(false)
    }

  return (
    <div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div className='container'>
            {loading && <div className="loader"></div>}
            {!loading && locationsLoaded 
             && !productsLoaded && (
                <>
                    <h1>Select a location</h1>
                    {locations.map(item => 
                        <Location
                            key={item.id}
                            name={item.name}
                            status={item.status}
                            style={item.status === 'available' ? {color: '#00C167'} : {color: '#000000', cursor: 'initial'}}
                            get={() => item.status === 'available' ? getLpnAndProducts(item.id, item.name) : null}
                        /> 
                    )}
                </>
            )}
            {!loading && productsLoaded 
             && selectedProgram === '' 
             && estimatedDuration === '' && (
                <>
                    <h1>Select a program</h1>
                    {products.map(item => 
                        <Product
                            key={item.productid}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            post={() => post(item.program)}
                        /> 
                    )}
                </>
            )}
            {!loading 
             && selectedProgram !== '' 
             && estimatedDuration !== '' && (
                <>
                    <h1>Location selected: {selectedLocation}</h1>
                    <h1>Program selected: {selectedProgram}</h1>
                    <h1>Estimated duration: {estimatedDuration} minutes</h1>
                </>
              )}
        </div>
    </div>
  );
}

export default App;
