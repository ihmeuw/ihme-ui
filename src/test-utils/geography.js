import topojson from 'topojson';
import usTopoJSON from './assets/usTopoJSON';

export const getTopoJSON = () => {
  return usTopoJSON;
};

export const getGeoJSON = (feature) => {
  if (usTopoJSON.objects[feature]) return topojson.feature(usTopoJSON, usTopoJSON.objects[feature]);
  return topojson.feature(usTopoJSON, usTopoJSON.objects.states);
};

export const getLocationIds = (features) => {
  return features.map(feature => {
    return feature.id;
  });
};
