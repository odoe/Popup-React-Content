import React, { useRef, useEffect, useState } from "react";

import PopupInfo from "./PopupInfo";
import PopupPortal from "./PopupPortal";

import SceneView from "@arcgis/core/views/SceneView";
import WebScene from "@arcgis/core/WebScene";

import "./App.css";

const popupRoot = document.createElement('div');

function App() {
  const mapDiv = useRef(null);

  const [ popupData, setPopupData ] = useState({});

  useEffect(() => {
    if (mapDiv.current) {
      const map = new WebScene({
        portalItem: {
          id: "5a392557cffb485f8fe004e668e9edc0",
        },
      });

      // Create the SceneView
      const sceneView = new SceneView({
        map: map,
        container: mapDiv.current,
        popup: {
          actions: [],
          dockEnabled: true,
          dockOptions: {
            buttonEnabled: true,
            breakpoint: false,
          },
        },
      });

      // Listen for when the scene view is ready
      sceneView.when(() => {
        // It's necessary to overwrite the default click for the popup
        // behavior in order to display your own popup
        sceneView.popup.autoOpenEnabled = false;
        sceneView.on("click", (event) => {
          // Make sure that there is a valid latitude/longitude
          if (event && event.mapPoint) {
            sceneView.popup.open({
              title: "My Popup",
              location: event.mapPoint,
              content: setContentInfo(sceneView.center),
            });
          } else {
            sceneView.popup.open({
              title: "Invalid point location",
              location: event.mapPoint,
              content: "Please click on a valid location.",
            });
          }
        });

        function setContentInfo(center) {
          setPopupData({
            title: "My Popup with React Portal",
            description: `This is my React Portal: center = ${JSON.stringify(center.toJSON())}`,
          });
          return popupRoot;
        }
      });
    }
  }, [mapDiv]);

  return <div className="mapDiv" ref={mapDiv}>
    <PopupPortal mount={popupRoot}>
      <PopupInfo data={popupData}></PopupInfo>
    </PopupPortal>
  </div>;
}

export default App;
