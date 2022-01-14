import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion } from 'react-native-maps';
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
  const [pins, setPins] = React.useState<any[]>([]);
  const [hasPinPress, setHasPinPress] = React.useState(false);

  const [usercoord, setUserCoord] = React.useState<coord>();
  const [pin_detail, setPinDetail] = React.useState<any>();

  const [center_coord, setCenterCoord] = React.useState<coord>();
  const [zoom, setZoom] = React.useState(0)
  const mapRef = React.useRef(null)

  const getLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            setCoord({
              latitude: 13.71486221,
              longitude: 100.5190202,
              latitudeDelta: 0.005,
              longitudeDelta: 0.0050
            });
            setUserCoord({
              latitude: 13.71486221,
              longitude: 100.5190202,
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

  const getPinBackend = (area: any, zoom_value: number, x1: number, x2: number, y1: number, y2: number) => {
    let pin: any = []
    let pins_of_area: any = []

    // customData.filter((f: any) => !pins.includes(f)).map((p: any) => {
    customData.map((p: any) => {
      if (p.Longitude >= x1 && p.Longitude <= x2 && p.Latitude >= y1 && p.Latitude <= y2) {
        if (zoom_value > 0.05) {
          for (let i = 0; i < area.length; i++) {
            if (area[i].haspin != true) {
              if (p.Longitude >= area[i].coord.x1 && p.Longitude <= area[i].coord.x2 && p.Latitude >= area[i].coord.y1 && p.Latitude <= area[i].coord.y2) {
                // pins_coord[i] = {
                //   lon: (pins_coord[i] != undefined ? pins_coord[i].lon : 0) + p.Longitude,
                //   pin_lon: (pins_coord[i] != undefined ? pins_coord[i].pin_lon : 0) + 1,
                //   lat: (pins_coord[i] != undefined ? pins_coord[i].lat : 0) + p.Latitude,
                //   pin_lat: (pins_coord[i] != undefined ? pins_coord[i].pin_lat : 0) + 1,
                // }
                pins_of_area[i] = pins_of_area[i] != undefined ? [...pins_of_area[i], p] : [p]
                // break;
              }
            }
            else {
              if (area[i].coord.x1 >= x1 && area[i].coord.x2 <= x2 && area[i].coord.y1 >= y1 && area[i].coord.y2 <= y2) {
              // console.log(area[i].previous_pin)
                pins_of_area[i] = [area[i].previous_pin]
              }
              else {
                pins_of_area[i] = null
              }
            }
            // }
          }
        }
        else {
          pin.push(p)
        }
      }
    })
    //   pins_coord.map((pc: any) => {
    //     if (pc != undefined) {
    //       pin.push({
    //         ID: "ManyOfTree",
    //         Longitude: pc.lon / pc.pin_lon,
    //         Latitude: pc.lat / pc.pin_lat,
    //       })
    //     }
    //   })
    // }

    // Pin ใน Map เมื่อค่า zoom_value > 0.05
    if (zoom_value > 0.05) {
      pins_of_area.map((poa: any, idx: number) => {
        if(poa != null){
          // console.log(poa)
          let random_pin = Math.floor(Math.random() * (poa.length))
          pin.push(poa[random_pin])          
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

  const onPressTreePin = async (event: any, idx: number) => {
    const pin_latitude = event.nativeEvent.coordinate.latitude;
    const pin_longitude = event.nativeEvent.coordinate.longitude;

    calculateDistance(
      usercoord?.latitude || 0,
      usercoord?.longitude || 0,
      pin_latitude,
      pin_longitude
    );
    if (zoom > 0.05) {
      setHasPinPress(false)
      mapRef.current.animateToRegion({
        latitude: pin_latitude,
        longitude: pin_longitude,
        latitudeDelta: 0.0017213923335042125,
        longitudeDelta: 0.0010665133595466614
      }, 500)
    }
    else {
      setHasPinPress(true)
    }

    setPinDetail({
      ID: pins[idx].ID,
      Latitude: pins[idx].Latitude,
      Longitude: pins[idx].Longitude
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
  };

  const onUserLocationChange = (event: any) => {
    // console.log(event.nativeEvent.coordinate)
    setUserCoord({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude
    })
  }

  const onRegionChangeComplete = (region: any) => {
    setCoord(region)

    let latitudeDelta = 0
    let longitudeDelta = 0

    let zoom_value = Number((region.latitudeDelta * 20).toFixed(2))
    // console.log('Zoom value: ', zoom_value)
    // console.log(region)
    if(zoom_value > 0.05 && zoom_value < 0.3 ){
      latitudeDelta = 0.014583252062347896
      longitudeDelta = 0.007607750594615936
    }
    else if (zoom_value >= 0.3 && zoom_value < 0.8){
      latitudeDelta = 0.03981106200619777
      longitudeDelta = 0.02077605575323105
    }
    else if (zoom_value >= 0.8 && zoom_value < 1.8){
      latitudeDelta = 0.08898927531797973
      longitudeDelta = 0.04642535001039505
    }
    else if (zoom_value >= 1.8 && zoom_value < 3.5){
      latitudeDelta = 0.17645393936866682
      longitudeDelta = 0.09208124130962858
    }
    else if (zoom_value >= 3.5 && zoom_value < 7.1){
      latitudeDelta = 0.35896078935970444
      longitudeDelta = 0.18733318895100126
    }
    else if (zoom_value >= 7.1 && zoom_value < 10.8){
      latitudeDelta = 0.5445484603835968
      longitudeDelta = 0.28420183807611465
    }
    else if (zoom_value >= 10.8){
      latitudeDelta = 0.8204964049245991
      longitudeDelta = 0.42811743915081024
    }
    else{
      latitudeDelta = region.longitudeDelta
      longitudeDelta = region.longitudeDelta
    }

    let area: any = []
    //Check Pin in Region
    let x1 = Number((region.longitude - region.longitudeDelta).toFixed(6))
    let x2 = Number((region.longitude + region.longitudeDelta).toFixed(6))
    let y1 = Number((region.latitude - region.latitudeDelta).toFixed(6))
    let y2 = Number((region.latitude + region.latitudeDelta).toFixed(6))

    let x1_area = Number((region.longitude - longitudeDelta).toFixed(6))
    let x2_area = Number((region.longitude + longitudeDelta).toFixed(6))
    let y1_area = Number((region.latitude - latitudeDelta).toFixed(6))
    let y2_area = Number((region.latitude + latitudeDelta).toFixed(6))


    let block_per_x = 16 //นับเป็น Block
    let block_per_y = 16 //นับเป็น Block
    let x_length = Number(((x2_area - x1_area) / block_per_x).toFixed(6))
    let y_length = Number(((y2_area - y1_area) / block_per_y).toFixed(6))



    if (center_coord != undefined) {

      // let pre_x1 = Number((previous_coord.longitude - previous_coord.longitudeDelta).toFixed(6))
      // let pre_x2 = Number((previous_coord.longitude + previous_coord.longitudeDelta).toFixed(6))
      // let pre_y1 = Number((previous_coord.latitude - previous_coord.latitudeDelta).toFixed(6))
      // let pre_y2 = Number((previous_coord.latitude + previous_coord.latitudeDelta).toFixed(6))
      // let Delta_X1 = Number((Math.abs(pre_x1 - x1) % x_length).toFixed(6))
      // let Delta_X2 = Number((Math.abs(pre_x2 - x1) % x_length).toFixed(6))
      // let Delta_Y1 = Number((Math.abs(pre_y1 - y1) % y_length).toFixed(6))
      // let Delta_Y2 = Number((Math.abs(pre_y2 - y2) % y_length).toFixed(6))
      // console.log(`Delta_X: ${Delta_X1},${Delta_X2} \nDelta_Y: ${Delta_Y1},${Delta_Y2}`)
      // x1 = x1 - Delta_X1
      // x2 = x2 - Delta_X2
      // y1 = y1 - Delta_Y1
      // y2 = y2 - Delta_Y2

      // console.log(region)
      // console.log(center_coord)

      let Delta_X = (Number(region.longitude.toFixed(6)) - Number(center_coord.longitude.toFixed(6))) % x_length
      let Delta_Y = (Number(region.latitude.toFixed(6)) - Number(center_coord.latitude.toFixed(6))) % y_length

      x1_area = Number((x1_area - Number(Delta_X.toFixed(6))).toFixed(6))
      x2_area = Number((x2_area - Number(Delta_X.toFixed(6))).toFixed(6))
      y1_area = Number((y1_area - Number(Delta_Y.toFixed(6))).toFixed(6))
      y2_area = Number((y2_area - Number(Delta_Y.toFixed(6))).toFixed(6))

    }
    else {
      setCenterCoord({
        latitude: region.latitude,
        longitude: region.longitude
      })
    }
    // console.log(`x1: ${x1}\nx2: ${x2}\ny1: ${y1}\ny2: ${y2}\nx_length: ${x_length}\ny_length: ${y_length}\n`)




    for (let y = 0; y < block_per_y; y++) {
      for (let x = 0; x < block_per_x; x++) {
        area.push({
          coord: {
            x1: x1_area + (x_length * x),
            x2: x1_area + (x_length * (x + 1)),
            y1: y1_area + (y_length * y),
            y2: y1_area + (y_length * (y + 1)),
          },
          haspin: false,
          previous_pin: {
            ID: null,
            Latitude: null,
            Longitude: null
          }
        })
      }
    }
    //Check if has Previous Pin in area
    pins.map((p: any) => {
      for (let i = 0; i < area.length; i++) {
        if (p.Longitude >= area[i].coord.x1 && p.Longitude <= area[i].coord.x2 && p.Latitude >= area[i].coord.y1 && p.Latitude <= area[i].coord.y2) {
          area[i].haspin = true
          area[i].previous_pin.ID = p.ID
          area[i].previous_pin.Latitude = p.Latitude
          area[i].previous_pin.Longitude = p.Longitude
        }
      }
    })

    // console.log(`x1: ${x1}\nx2: ${x2}\ny1: ${y1}\ny2: ${y2}`)

    setZoom(zoom_value)
    // console.log(`zoom: ${zoom_value}`)

    //Backend simulation
    let assignpin: any = [];
    let res: any = []
    // setPins([])
    res = getPinBackend(area, zoom_value, x1, x2, y1, y2);

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
              ref={mapRef}
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
                    pinColor={'blue'}
                    coordinate={{ latitude: p.Latitude, longitude: p.Longitude }}
                    // description={`${calculateDistance} meter`}
                    onPress={(e) => onPressTreePin(e, idx)}
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
                      <Text style={{ color: 'black' }}>{pin_detail?.ID}</Text>
                      {/* <TouchableOpacity
                        style={{ width: 40, height: 40, backgroundColor: 'gray' }}
                        onPress={NavigateToGoogleMap}
                      >
                      </TouchableOpacity> */}
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