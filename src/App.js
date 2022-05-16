import React, { useRef, useEffect, useState } from "react";

import PopupInfo from "./PopupInfo";
import PopupPortal from "./PopupPortal";

import MapView from "@arcgis/core/views/MapView";
import ArcGISMap from "@arcgis/core/Map";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import { whenOnce, watch } from "@arcgis/core/core/reactiveUtils";

import "./App.css";

const popupRoot = document.createElement('div');

function App() {
  const mapDiv = useRef(null);

  const [ popupData, setPopupData ] = useState({});

  useEffect(() => {
    if (mapDiv.current) {
      const clusterConfig = {
        type: "cluster",
        clusterRadius: "100px",
        popupTemplate: {
          title: "Cluster summary",
          content: popupRoot,
          fieldInfos: [
            {
              fieldName: "cluster_count",
              format: {
                places: 0,
                digitSeparator: true
              }
            }
          ]
        },
        clusterMinSize: "24px",
        clusterMaxSize: "60px",
        labelingInfo: [
          {
            deconflictionStrategy: "none",
            labelExpressionInfo: {
              expression: "Text($feature.cluster_count, '#,###')"
            },
            symbol: {
              type: "text",
              color: "#004a5d",
              font: {
                weight: "bold",
                family: "Noto Sans",
                size: "12px"
              }
            },
            labelPlacement: "center-center"
          }
        ]
      };

      const layer = new GeoJSONLayer({
        title: "Earthquakes from the last month",
        url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
        copyright: "USGS Earthquakes",
        outFields: ["*"],
        featureReduction: clusterConfig,

        // popupTemplates can still be viewed on
        // individual features
        popupTemplate: {
          title: "Magnitude {mag} {type}",
          content: popupRoot,
          fieldInfos: [
            {
              fieldName: "time",
              format: {
                dateFormat: "short-date-short-time"
              }
            }
          ]
        },
        renderer: {
          type: "simple",
          field: "mag",
          symbol: {
            type: "simple-marker",
            size: 4,
            color: "#69dcff",
            outline: {
              color: "rgba(0, 139, 174, 0.5)",
              width: 5
            }
          }
        }
      });


      const map = new ArcGISMap({
        basemap: "dark-gray-vector",
        layers: [layer]
      });

      const view = new MapView({
        map,
        container: mapDiv.current,
        center: [-118, 34],
        zoom: 6
      });

      watch(
        () => view.popup.selectedFeature,
        (feature) => {
          console.log("Selected Feature", feature);
          if (feature.isAggregate) {
            setPopupData({
              title: "My Cluster Popup with React Portal",
              description: `Cluster ID: ${feature.attributes.clusterId}, has ${feature.attributes.cluster_count} features`,
            });
          }
          else {
            setPopupData({
              title: "My Feature Popup with React Portal",
              description: `Magnitude ${feature.attributes.mag} ${feature.attributes.type} hit ${feature.attributes.place} on ${feature.attributes.time}.`,
            });
          }
        }
      );

      whenOnce(() => view.ready).then(() => console.log("view is ready"));
    }
  }, [mapDiv]);

  return <div className="mapDiv" ref={mapDiv}>
    <PopupPortal mount={popupRoot}>
      <PopupInfo data={popupData}></PopupInfo>
    </PopupPortal>
  </div>;
}

export default App;
