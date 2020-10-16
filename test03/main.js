
window.onload = init;

function init(){
  var gsiAttributions = "<a href=\"https://github.com/gsi-cyberjapan/vector-tile-experiment\">国土地理院ベクトルタイル提供実験</a>";
  var baseLayer = new ol.layer.Tile({
    title:'国土地理院標準',
    type: 'base',
    visble: true ,
    source: new ol.source.XYZ({
      attributions: "<a href='http://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>",
      url: "http://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
      projection: "EPSG:3857",
      title: 'baseMAP',
      type: 'base',
      visble: true
    })
  });

  var roadLayer = new ol.layer.VectorTile({
    title:'道路中心線',
    visble: true,
    source: new ol.source.VectorTile({
        attributions: gsiAttributions,
      format: new ol.format.GeoJSON(),
      tileGrid: new ol.tilegrid.createXYZ(),
      url: 'https://cyberjapandata.gsi.go.jp/xyz/experimental_rdcl/{z}/{x}/{y}.geojson',
      title: 'roadMAP',
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
    title:'鉄道',
    visble: true,
    source: new ol.source.VectorTile({
      attributions: gsiAttributions,
      format: new ol.format.GeoJSON(),
      tileGrid: new ol.tilegrid.createXYZ(),
      url: 'https://cyberjapandata.gsi.go.jp/xyz/experimental_railcl/{z}/{x}/{y}.geojson',
      title: 'railMAP',
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
    title:'河川',
    visble: true,
    source: new ol.source.VectorTile({
      attributions: gsiAttributions,
      format: new ol.format.GeoJSON(),
      tileGrid: new ol.tilegrid.createXYZ(),
      url: 'https://cyberjapandata.gsi.go.jp/xyz/experimental_rvrcl/{z}/{x}/{y}.geojson',
      title: 'riverMAP',
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
    title:'数値',
    type: 'base',
    visble: false ,
    source: new ol.source.VectorTile({
        attributions:  gsiAttributions,
        format: new ol.format.GeoJSON(),
        tileGrid: new ol.tilegrid.createXYZ(),
        url: 'https://cyberjapandata.gsi.go.jp/xyz/experimental_fgd/{z}/{x}/{y}.geojson',
        title: 'basicKihon',
        minZoom:18,
        tileSize: 512
        
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'blue',
        width: 1,
        lineCap: "butt"
      })
    })
  });
  // Calculation of resolutions that match zoom levels 1, 3, 5, 7, 9, 11, 13, 15.
  var resolutions = [];
  for (var i = 0; i <= 17; ++i) {
    resolutions.push(156543.03392804097 / Math.pow(2, i+1));
  }

  // Calculation of tile urls for zoom levels 1, 3, 5, 7, 9, 11, 13, 15.
  function tileUrlFunction(tileCoord) {


    var url = ('https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf')
    .replace('{z}', String(tileCoord[0]))
    .replace('{x}', String(tileCoord[1]))
    .replace('{y}', String(tileCoord[2]))
    .replace(
      '{a-d}',
      'abcd'.substr(((tileCoord[1] << tileCoord[0]) + tileCoord[2]) % 4, 1)
    ); //'https://cyberjapandata.gsi.go.jp/xyz/experimental_fgd/{z}/{x}/{y}.geojson' 
    console.log(url);
    return url;
  }

  var superVectorLayer = new ol.layer.VectorTile({
    title:'vector数値',
    type: 'base',
    visble: false ,
    source: new ol.source.VectorTile({
      attributions:gsiAttributions,
      //format: new ol.format.GeoJSON(),// pbf -> new ol.format.MVT(),
      format: new ol.format.MVT(),
      tileGrid: new ol.tilegrid.TileGrid({
        extent: ol.proj.get('EPSG:3857').getExtent(),
        resolutions: resolutions,
        tileSize: 512,
      }),
      tileUrlFunction: tileUrlFunction,
    })
    //,    style: createMapboxStreetsV6Style(Style, Fill, Stroke, Icon, Text),
  })


  var groupLayer1 = new ol.layer.Group({
    // A layer must have a title to appear in the layerswitcher
    title: 'Base maps',
    layers: [
      basicKihonLayer,
      superVectorLayer,
      baseLayer
    ]
  });

  var groupLayer2  = new ol.layer.Group({
    // A layer must have a title to appear in the layerswitcher
    title: 'レイヤーのほう',
    fold: 'open',
    layers: [
      roadLayer,
      railLayer,
      riverLayer

    ]
  });


  var map = new ol.Map({
    target: 'map',
    controls: ol.control.defaults({
      attributionOptions: ({
                collapsible: true
            })
    }),
    layers: [
      groupLayer1,
      groupLayer2
    ],
    view: new ol.View({
      center:ol.proj.fromLonLat([ 141.356,43.061]), 
      zoom: 16,
      maxZoom: 20,
      minZoom: 4
    })
  });
  map.addControl(new ol.control.Zoom());
  map.addControl(new ol.control.FullScreen());
  var layerSwitcher = new ol.control.LayerSwitcher({
    activationMode: 'click',
    tipLabel: 'Show layer list', // Optional label for button
    collapseTipLabel: 'Hide layer list', // Optional label for button
    groupSelectStyle: 'children' // Can be 'children' [default], 'group' or 'none'
  });
  map.addControl(layerSwitcher);

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