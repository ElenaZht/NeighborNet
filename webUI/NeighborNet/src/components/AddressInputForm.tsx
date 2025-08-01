import { useState, useEffect, useRef, forwardRef, useImperativeHandle, ChangeEvent } from 'react';
import { loadGoogleMapsScript } from '../utils/googleMapsLoader';
import { useClickAway } from '../utils/useClickAway';

interface AddressResult {
  address: string;
  city: string;
  location: { lat: number; lng: number };
}

interface AddressInputFormProps {
  onAddressSelect: (addressResult: AddressResult) => void;
  initialAddress?: string;
}

export interface AddressInputFormRef {
  clearAddress: () => void;
}

const AddressInputForm = forwardRef<AddressInputFormRef, AddressInputFormProps>(({ onAddressSelect, initialAddress }, ref) => {
  const [address, setAddress] = useState('');
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const autocompleteRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [warning, setWarning] = useState('');
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Set initial address when component mounts or initialAddress changes
  useEffect(() => {
    if (initialAddress && initialAddress !== address) {
      setAddress(initialAddress);
    }
  }, [initialAddress]);

  useImperativeHandle(ref, () => ({
    clearAddress: () => {
      setAddress('');
    }
  }));

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
        const mapWithMarkers = mapRef.current as google.maps.Map & { markers?: google.maps.Marker[] };
        mapWithMarkers.markers?.forEach((marker: google.maps.Marker) => marker.setMap(null));
        
        // Add new marker
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: mapRef.current,
          animation: google.maps.Animation.DROP
        });
        
        // Store markers for later cleanup
        mapWithMarkers.markers = [marker];
      }
    }
  }, [coordinates]);

  const initAutocomplete = () => {
    // Create a new session token
    sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
    autocompleteRef.current = new google.maps.places.AutocompleteService();
  };

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);

    setLoading(true);

    if (value.length > 2 && autocompleteRef.current) {
      autocompleteRef.current.getPlacePredictions(
        {
          input: value,
          sessionToken: sessionTokenRef.current || undefined,
        },
        handlePredictions
      );
    } else {
      setPredictions([]);
      setShowSuggestions(false);
      setLoading(false);
    }
  };

  const handlePredictions = (predictions: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
    setLoading(false);
    
    if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
      setPredictions([]);
      setShowSuggestions(false);
      return;
    }
    
    setPredictions(predictions);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: google.maps.places.AutocompletePrediction) => {
    setAddress(suggestion.description);
    setPredictions([]);
    setShowSuggestions(false);
    
    // Create a new session token for the next request
    sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
    
    // Get detailed place information
    const placesService = new google.maps.places.PlacesService(document.createElement('div'));
    placesService.getDetails(
      {
        placeId: suggestion.place_id,
        fields: ['address_components', 'formatted_address', 'geometry'],
        sessionToken: sessionTokenRef.current || undefined
      },
      (place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          if (place.geometry && place.geometry.location) {
            setCoordinates({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            });
            // find city in place object
            const city = place.address_components?.find((c) => c.types.includes('locality'))?.long_name;
            
            if (!city) {
              setWarning('Unable to detect city from this address. Please try a more specific address or select a different location.');
            } else {
              setWarning('');
            }
            
            onAddressSelect({
              address: suggestion.description, 
              location: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              }, 
              city: city || ''
            });
          }
        }
      }
    );
  };

  // Close suggestions when clicking outside - rename to avoid conflict
  const suggestionsContainerRef = useClickAway(() => {
    setShowSuggestions(false);
  });

  return (
    <div className="card w-full max-w-md bg-base-100">
      <div className="card-body">        
        <div className="form-control w-full">
          <div className="relative" ref={suggestionsContainerRef}>
            <label className="label">
              <span className="label-text font-medium">Pickup Address</span>
            </label>
            
            <input
              ref={inputRef}
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
})

export default AddressInputForm;