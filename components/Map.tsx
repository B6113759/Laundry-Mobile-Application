import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions, PermissionsAndroid, Text, Pressable, Linking, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import Geolocation from 'react-native-geolocation-service';

const customData = require('../assets/data/tree.json');

let ScreenHeight = Dimensions.get("window").height;

const url = 'https://www.google.com/maps'

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
  const [pin_detail, setPinDetail] = React.useState<pin>();

  const [screen_coord, setScreenCoord] = React.useState<coord>();

  const [errorshow, setErrorShow] = React.useState("");

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

  // const getPinBackend = (x1: number, x2: number, y1: number, y2: number) => {
  //   let pin: pin[] = []
  //   customData.filter((f: any) => !pins.includes(f)).map((p: any) => {
  //     if (p.Longitude >= x1 && p.Longitude <= x2) {
  //       if (p.Latitude >= y1 && p.Latitude <= y2) {
  //         // console.log(p.name + ' is in area.')
  //         pin.push(p)
  //       }
  //     }
  //   })
  //   console.log(pin)
  //   return pin
  // }

  const getPinBackend = (area: any, zoom_value: number) => {
    let pin: any = []
    let pins_coord: any = []

    // customData.filter((f: any) => !pins.includes(f)).map((p: any) => {
    customData.map((p: any) => {
      // if (p.Longitude >= x1 && p.Longitude <= x2 && p.Latitude >= y1 && p.Latitude <= y2) {
        if (zoom_value > 0.05) {
          for (let i = 0; i < area.length; i++) {
            if (p.Longitude >= area[i].x1 && p.Longitude <= area[i].x2 && p.Latitude >= area[i].y1 && p.Latitude <= area[i].y2) {
              pins_coord[i] = {
                lon: (pins_coord[i] != undefined? pins_coord[i].lon : 0) + p.Longitude,
                pin_lon: (pins_coord[i] != undefined? pins_coord[i].pin_lon : 0) + 1,
                lat: (pins_coord[i] != undefined? pins_coord[i].lat : 0) + p.Latitude,
                pin_lat: (pins_coord[i] != undefined? pins_coord[i].pin_lat : 0) + 1,
              }
              break;
            }
            // }
          }
        }
        else {
          pin.push(p)
        }
      // }
    })
    // Pin ใน Map เมื่อค่า zoom_value > 0.05
    if (zoom_value > 0.05) {
      pins_coord.map((pc: any) => {
        if(pc != undefined){
          pin.push({
            ID: "ManyOfTree",
            Longitude: pc.lon / pc.pin_lon,
            Latitude: pc.lat / pc.pin_lat,
      })
        }
      })
    }
    return pin
  }

  const onPressMap = () => {
    setHasPinPress(false);
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

    // console.log(d);
    return d;
  }

  const onPressPin = async (event: any, idx: number) => {
    const pin_latitude = event.nativeEvent.coordinate.latitude;
    const pin_longitude = event.nativeEvent.coordinate.longitude;

    calculateDistance(
      usercoord?.latitude || 0,
      usercoord?.longitude || 0,
      pin_latitude,
      pin_longitude
    );
    setHasPinPress(true);

    setPinDetail({
      name: pins[idx].name,
      coord: {
        latitude: pins[idx].coord.latitude,
        longitude: pins[idx].coord.longitude
      }
    })

    //Open Google Map
    // const url = 'https://www.google.com/maps/dir'
    // const supported = await Linking.canOpenURL(url);
    // if (supported){
    //   await Linking.openURL(`${url}//${pin_latitude},${pin_longitude}`);
    // }
  }

  const NavigateToGoogleMap = async () => {
    //Open Google Map
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(`${url}/dir//${pin_detail?.coord.latitude},${pin_detail?.coord.longitude}`);
    }
    else {
      setErrorShow('cannot open link');
    }
  };

  const onUserLocationChange = (event: any) => {
    // console.log(event.nativeEvent.coordinate)
    setUserCoord({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude
    })
  }

  const onRegionChangeComplete = (region: any, detail: any) => {
    let area = []
    //Check Pin in Region
    let x1 = region.longitude - region.longitudeDelta
    let x2 = region.longitude + region.longitudeDelta
    let y1 = region.latitude - region.latitudeDelta
    let y2 = region.latitude + region.latitudeDelta

    let block_per_x = 16 //นับเป็น Block
    let block_per_y = 16 //นับเป็น Block
    let x_length = (x2 - x1) / block_per_x
    let y_length = (y2 - y1) / block_per_y

    if (screen_coord != undefined) {
      console.log(screen_coord)
      console.log(region)
    }

    setScreenCoord({
      latitude: region.latitude,
      longitude: region.longitude
    })

    

    for (let y = 0; y < block_per_y; y++) {
      for (let x = 0; x < block_per_x; x++) {
        area.push({
          x1: x1 + (x_length * x),
          x2: x1 + (x_length * (x + 1)),
          y1: y1 + (y_length * y),
          y2: y1 + (y_length * (y + 1)),

        })
      }
    }

    console.log(`x1: ${x1}\nx2: ${x2}\ny1: ${y1}\ny2: ${y2}`)

    let zoom_value = Number((region.latitudeDelta * 20).toFixed(2))
    console.log(`zoom: ${zoom_value}`)

    //Backend simulation
    let assignpin: pin[] = [];
    let res: any = []
    // setPins([])
    res = getPinBackend(area, zoom_value);

    // pins.map((p) => assignpin.push(p));
    res.map((p: any) => assignpin.push(p));
    setPins(assignpin);
  }

  return (
    <View style={styles.container}>
      {
        hasLocationPermission ? (
          <View style={{ width: '100%', height: '100%' }}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={coord}
              rotateEnabled={false}
              onRegionChangeComplete={onRegionChangeComplete}
              onUserLocationChange={onUserLocationChange}
              onPress={onPressMap}
              userLocationUpdateInterval={10000}
              showsMyLocationButton={true}
              showsUserLocation={true}
              toolbarEnabled={false}
              userLocationPriority='high'
              minZoomLevel={10}
            >
              {
                pins.map((p: any, idx) => (
                  <Marker
                    key={idx}
                    pinColor='blue'
                    coordinate={{ latitude: p.Latitude, longitude: p.Longitude }}
                    // description={`${calculateDistance} meter`}
                    onPress={(e) => onPressPin(e, idx)}
                  />
                ))
              }
            </MapView>
            {
              hasPinPress ? (
                <View style={styles.pinbar} >
                  <View style={{
                    width: '100%',
                    height: 200,
                    backgroundColor: 'white',
                    alignSelf: 'center',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  }}>
                    <View style={{ margin: 20 }}>
                      <Text style={{ color: 'black' }}>{pin_detail?.name}</Text>
                      <Text style={{ color: 'black' }}>{errorshow}</Text>
                      <TouchableOpacity
                        style={{ width: 40, height: 40, backgroundColor: 'gray' }}
                        onPress={NavigateToGoogleMap}
                      >
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : null
            }

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
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  pinbar: {
    // flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
    width: '100%',
  }
});

export default Map;