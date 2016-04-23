import topojson from 'topojson';
import usTopoJSON from './assets/usaTopoJSON';

export const getTopoJSON = () => {
  return usTopoJSON;
};

export const getGeoJSON = (feature, type = 'feature') => {
  if (!usTopoJSON.objects[feature]) {
    throw new Error(
      `${feature} is not within the objects collection of the test topojson`
    );
  }

  if (type === 'feature') return topojson.feature(usTopoJSON, usTopoJSON.objects[feature]);
  if (type === 'mesh') return topojson.mesh(usTopoJSON, usTopoJSON.objects[feature]);
};

export const getLocationIds = (features) => {
  return features.map(feature => {
    return feature.id;
  });
};
