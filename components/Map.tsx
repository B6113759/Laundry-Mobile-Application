import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions, PermissionsAndroid, Linking } from 'react-native';
import React, { useEffect } from 'react';
import Geolocation from 'react-native-geolocation-service';


let ScreenHeight = Dimensions.get("window").height;

type coord = {
  latitude: number,
  longitude: number,
}

type mapcoord = {
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
}

type pin = {
  name: string,
  coord: {
    latitude: number,
    longitude: number,
  }
}

const initPins = [
  {
    name: "Wash1", coord: { latitude: 14.90034, longitude: 102.0563 }
  },
  {
    name: "Wash2", coord: { latitude: 14.9101, longitude: 102.0009 }
  },
  {
    name: "Wash3", coord: { latitude: 14.8786, longitude: 102.0073 }
  },
]

const Map: React.FC = () => {

  const [coord, setCoord] = React.useState<mapcoord>();
  const [hasLocationPermission, setHasLocationPermission] = React.useState(false);
  const [pins, setPins] = React.useState<pin[]>([]);
  const [hasPinPress, setHasPinPress] = React.useState(false);

  const [usercoord, setUserCoord] = React.useState<coord>();

  const getLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            setCoord({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.0050
            });
            setUserCoord({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setHasLocationPermission(true);
          },
          (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
        );

      } else {
        setHasLocationPermission(false);
      }
    } catch (err) {
      console.warn(err);
    }
  }

  useEffect(() => {
    getLocation();
  }, [])

  const getPinBackend = (x1: number, x2: number, y1: number, y2: number) => {
    let pin: pin[] = []
    initPins.filter((f) => !pins.includes(f)).map((p: pin) => {
      if (p.coord.longitude >= x1 && p.coord.longitude <= x2) {
        if (p.coord.latitude >= y1 && p.coord.latitude <= y2) {
          // console.log(p.name + ' is in area.')
          pin.push(p)
        }
      }
    })
    return pin
  }

  //Ref https://www.movable-type.co.uk/scripts/latlong.html
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres

    console.log(d);
    // return d;
  }

  const onPressPin = async (event: any) => {
    const pin_latitude = event.nativeEvent.coordinate.latitude;
    const pin_longitude = event.nativeEvent.coordinate.longitude;

    calculateDistance(
      usercoord?.latitude || 0,
      usercoord?.longitude || 0,
      pin_latitude,
      pin_longitude
    );
    setHasPinPress(true);

    //Open Google Map
    const url = 'https://www.google.com/maps/dir'
    const supported = await Linking.canOpenURL(url);
    if (supported){
      await Linking.openURL(`${url}//${pin_latitude},${pin_longitude}`);
    }
  }

  const onUserLocationChange = (event: any) => {
    // console.log(event.nativeEvent.coordinate)
    setUserCoord({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude
    })
  }

  const onRegionChangeComplete = (region: any, detail: any) => {
    //Check Pin in Region
    let x1 = region.longitude - region.longitudeDelta
    let x2 = region.longitude + region.longitudeDelta
    let y1 = region.latitude - region.latitudeDelta
    let y2 = region.latitude + region.latitudeDelta

    console.log(`x1: ${x1}\nx2: ${x2}\ny1: ${y1}\ny2: ${y2}`)

    //Backend simulation
    let assignpin: pin[] = [];
    const res: pin[] = getPinBackend(x1, x2, y1, y2);

    pins.map((p) => assignpin.push(p));
    res.map((p) => assignpin.push(p))
    setPins(assignpin);
  }

  return (
    <View style={styles.container}>
      {
        hasLocationPermission ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={coord}
            rotateEnabled={false}
            onRegionChangeComplete={onRegionChangeComplete}
            onUserLocationChange={onUserLocationChange}
            userLocationUpdateInterval={10000}
            showsMyLocationButton={true}
            showsUserLocation={true}
            toolbarEnabled={false}
            userLocationPriority='high'
            minZoomLevel={10}
          >
            {
              pins.map((p: pin, idx) => (
                <Marker
                  key={idx}
                  pinColor='blue'
                  coordinate={{ latitude: p.coord.latitude, longitude: p.coord.longitude }}
                  // description={`${calculateDistance} meter`}
                  onPress={onPressPin}
                />
              ))
            }
          </MapView>
        ) : null
      }
      {
        hasPinPress ? (
          <View style={styles.pinbar}>

          </View>
        ) : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: ScreenHeight,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'black'
  },
  pinbar: {
    flex: 1,
    backgroundColor: 'while',
    width: '100%',
    height: 500,
    position: 'absolute',
  }
});

export default Map;