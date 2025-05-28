import React, { useState, useEffect, useRef } from 'react';
import { loadGoogleMapsScript } from '../utils/googleMapsLoader';


export default function AddressInputForm({ onMySelect }) {
  const [address, setAddress] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const [coordinates, setCoordinates] = useState(null);
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [warning, setWarning] = useState('')
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  // Initialize Google Places API
  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => {
        initAutocomplete();
      })
      .catch(error => {
        console.error('Error loading Google Maps API:', error);
        setWarning('Failed to load maps. Please try again later.');
      });
  }, []);


    useEffect(() => {
    if (coordinates && mapContainerRef.current) {
      const { lat, lng } = coordinates;
      
      // If map doesn't exist yet, create it
      if (!mapRef.current) {
        mapRef.current = new google.maps.Map(mapContainerRef.current, {
          center: { lat, lng },
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        });
        
        // Create marker
        new google.maps.Marker({
          position: { lat, lng },
          map: mapRef.current,
          animation: google.maps.Animation.DROP
        });
      } else {
        // Update existing map
        mapRef.current.setCenter({ lat, lng });
        
        // Clear existing markers
        mapRef.current.markers?.forEach(marker => marker.setMap(null));
        
        // Add new marker
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: mapRef.current,
          animation: google.maps.Animation.DROP
        });
        
        // Store markers for later cleanup
        mapRef.current.markers = [marker];
      }
    }
  }, [coordinates]);

  const initAutocomplete = () => {
    // Create a new session token
    sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
    autocompleteRef.current = new google.maps.places.AutocompleteService();
  };

  // Handle input changes and fetch predictions
  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);

    setLoading(true);

    if (value.length > 2 && autocompleteRef.current) {
      autocompleteRef.current.getPlacePredictions(
        {
          input: value,
          sessionToken: sessionTokenRef.current,
          // componentRestrictions: { country: 'us' }, // Optional: restrict to US
        },
        handlePredictions
      );
    } else {
      setPredictions([]);
      setShowSuggestions(false);
      setLoading(false);
    }
  };

  const handlePredictions = (predictions, status) => {
    setLoading(false);
    
    if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
      setPredictions([]);
      setShowSuggestions(false);
      return;
    }
    
    setPredictions(predictions);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setAddress(suggestion.description);
    setPredictions([]);
    setShowSuggestions(false);
    
    // Create a new session token for the next request
    sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
    
    // Optional: Get detailed place information
    const placesService = new google.maps.places.PlacesService(document.createElement('div'));
    placesService.getDetails(
      {
        placeId: suggestion.place_id,
        fields: ['address_components', 'formatted_address', 'geometry'],
        sessionToken: sessionTokenRef.current
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          if (place.geometry && place.geometry.location) {
            setCoordinates({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            });
            // find street in place object
            const street = (place.address_components?.find(c => c.types.includes('route'))?.long_name)
            const city = (place.address_components?.find(c => c.types.includes('locality'))?.long_name)
            setCity(city)
            setStreet(street)
            onMySelect({address: suggestion.description, location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            }, city: city});
            

          }        }
      }
    );
    
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Enter Address</h2>
        
        <div className="form-control w-full">
          <div className="relative" ref={inputRef}>
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            
            <input
              type="text"
              value={address}
              onChange={handleAddressChange}
              placeholder="Start typing your address..."
              className="input input-bordered w-full"
              autoComplete="off"
            />
            
            {loading && (
              <span className="absolute right-3 top-12">
                <span className="loading loading-spinner loading-xs"></span>
              </span>
            )}
            
            {showSuggestions && predictions.length > 0 && (
              <ul className="menu bg-base-100 w-full p-2 rounded-box shadow-lg absolute z-10 mt-1">
                {predictions.map((prediction) => (
                  <li key={prediction.place_id}>
                    <a 
                      onClick={() => handleSuggestionClick(prediction)}
                      className="hover:bg-base-200"
                    >
                      {prediction.description}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
                {address && (
          <div className="mt-4 p-4 bg-base-200 rounded-lg">
            <p className="font-medium">Selected Address:</p>
                {warning && 
      <div className="alert alert-warning my-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{warning}</span>
      </div>
    }
            <p>{address}</p>
            {coordinates && (
              <>
                <p className="mt-2 text-sm">
                  Coordinates: lat:{coordinates.lat.toFixed(6)}, lng:{coordinates.lng.toFixed(6)}
                </p>
                <p>
                  Street: {street}
                  City: {city}
                </p>
                
                {/* Map container */}
                <div 
                  ref={mapContainerRef} 
                  className="w-full h-64 mt-3 rounded-lg overflow-hidden border border-base-300"
                ></div>
              </>
            )}
            

          </div>
        )}
      </div>
    </div>
  );
}