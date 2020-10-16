window.onload = init;

function init(){
  var gsiAttributions = "<a href=\"https://github.com/gsi-cyberjapan/vector-tile-experiment\">国土地理院ベクトルタイル提供実験</a>";
  var baseLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      attributions: "<a href='http://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>",
      url: "http://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
      projection: "EPSG:3857",
      title: 'baseMAP'
    })
  });

  var roadLayer = new ol.layer.VectorTile({
    source: new ol.source.VectorTile({
        attributions: gsiAttributions,
      format: new ol.format.GeoJSON(),
      tileGrid: new ol.tilegrid.createXYZ(),
      url: 'https://cyberjapandata.gsi.go.jp/xyz/experimental_rdcl/{z}/{x}/{y}.geojson',
      title: 'roadMAP'
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'green',
        width: 1,
        lineCap: "butt"
      })
    })
  });
  var railLayer = new ol.layer.VectorTile({
    source: new ol.source.VectorTile({
      attributions: gsiAttributions,
      format: new ol.format.GeoJSON(),
      tileGrid: new ol.tilegrid.createXYZ(),
      url: 'https://cyberjapandata.gsi.go.jp/xyz/experimental_railcl/{z}/{x}/{y}.geojson',
      title: 'railMAP'
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'yellow',
        width: 2,
        lineCap: "butt"
      })
    })
  });
  var riverLayer = new ol.layer.VectorTile({
    source: new ol.source.VectorTile({
      attributions: gsiAttributions,
      format: new ol.format.GeoJSON(),
      tileGrid: new ol.tilegrid.createXYZ(),
      url: 'https://cyberjapandata.gsi.go.jp/xyz/experimental_rvrcl/{z}/{x}/{y}.geojson',
      title: 'riverMAP'
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'blue',
        width: 3,
        lineCap: "butt"
      })
    })
  });


  var basicKihonLayer = new ol.layer.VectorTile({
      source: new ol.source.VectorTile({
          attributions:  gsiAttributions,
          format: new ol.format.GeoJSON(),
          tileGrid: new ol.tilegrid.createXYZ(),
          url: 'https://cyberjapandata.gsi.go.jp/xyz/experimental_fgd/{z}/{x}/{y}.geojson',
          title: 'basicKihon'
          
      }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'blue',
        width: 3,
        lineCap: "butt"
      })
    })
  });





  var map = new ol.Map({
    target: 'map',
    controls: ol.control.defaults({
      attributionOptions: ({
                collapsible: true
            })
    }),
    layers: [
      basicKihonLayer,
      baseLayer,
      roadLayer,
      railLayer,
      riverLayer
    ],
    view: new ol.View({
      center:ol.proj.fromLonLat([ 141.356,43.061]), 
      zoom: 16,
      maxZoom: 16,
      minZoom: 4
    })
  });
  map.addControl(new ol.control.Zoom());
  map.addControl(new ol.control.FullScreen());


  //https://ufirst.jp/memo/category/openlayers/
  //https://monakaice88.hatenablog.com/entry/2016/02/18/074304

  //http://kamoland.com/wiki/wiki.cgi?OpenLayers%A4%CE%A5%BA%A1%BC%A5%E0%A5%DC%A5%BF%A5%F3%A4%F2%A5%AB%A5%B9%A5%BF%A5%DE%A5%A4%A5%BA
  //https://qiita.com/maitake9116/items/4f1d7b3b6748dc42f09c
  //https://qiita.com/baikichiz/items/161b47a7b3d3a0aa6613

}

function changeBaseLayerVisible() {
  baseLayer.setVisible($("#base_layer_visible").prop("checked"));
}

function changeRoadLayerVisible() {
  roadLayer.setVisible($("#road_layer_visible").prop("checked"));
}
function changeRailLayerVisible() {
  railLayer.setVisible($("#rail_layer_visible").prop("checked"));
}
function changeRiverLayerVisible() {
  riverLayer.setVisible($("#river_layer_visible").prop("checked"));
}