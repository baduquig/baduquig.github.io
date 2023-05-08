function renderMap(data) {
    var plotPoints = {
        type:'scattergeo',
        locationmode: 'USA-states',
        //lat: filteredData.map(game => game.latitude),
        //lon: filteredData.map(game => game.longitude),
        //hoverinfor:  unpack(rows, 'airport'),
        //text:  unpack(rows, 'airport'),
        mode: 'markers'
    }

    var layout = {
        colorbar: true,
        geo: {
            scope: 'usa',
            projection: {
                type: 'usa'
            }
        },
        margin: {
            l: 5,
            r: 5,
            b: 5,
            t: 5,
            pad: 2
          }
    }

    Plotly.newPlot('map', plotPoints, layout);
}