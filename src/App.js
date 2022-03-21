import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";

import PopupInfo from "./PopupInfo";

import SceneView from "@arcgis/core/views/SceneView";
import WebScene from "@arcgis/core/WebScene";

import "./App.css";

const popupRoot = document.createElement('div');

function App() {
  const mapDiv = useRef(null);

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
              // Set the popup's title to the coordinates of the location
              title: "My Popup",
              location: event.mapPoint, // Set the location of the popup to the clicked location
              content: setContentInfo(sceneView.center, sceneView.scale),
            });
          } else {
            sceneView.popup.open({
              // Set the popup's title to the coordinates of the location
              title: "Invalid point location",
              location: event.mapPoint, // Set the location of the popup to the clicked location
              content: "Please click on a valid location.",
            });
          }
        });

        function setContentInfo(center, scale) {
          ReactDOM.unmountComponentAtNode(popupRoot)
          ReactDOM.render(
            <PopupInfo
              data={{
                title: "My Popup with React",
                description:
                  `This is my React Component: center = ${JSON.stringify(center.toJSON())}`,
              }}
            />,
            popupRoot
          );
          return popupRoot;
        }
      });
    }
  }, [mapDiv]);

  return <div className="mapDiv" ref={mapDiv}></div>;
}

export default App;
