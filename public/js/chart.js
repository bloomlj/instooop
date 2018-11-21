// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('chart'));


//获取服务器数据
$.getJSON(window.location.href+"?json=1", function(json){
  //alert("JSON Data: " + json);
  console.log(json);

  var valueArray = new Array();
  var indicatorArray = new Array();
  for (var variable in json.score) {
    if (json.score.hasOwnProperty(variable)) {
      valueArray.push(json.score[variable]);
      indicatorArray.push({'name':variable,'max':100});
      console.log(valueArray);
      console.log(indicatorArray);
    }
  }
  valueArrayFix = valueArray.slice(0,-1);
  indicatorArrayFix = indicatorArray.slice(0,-1);

  // 指定图表的配置项和数据
  option = {
      title: {
          text: '座椅评测'
      },
      tooltip: {},
      legend: {
          data: ['座椅评测']
      },
      radar: {
          // shape: 'circle',
          name: {
              textStyle: {
                  color: '#fff',
                  backgroundColor: '#999',
                  borderRadius: 3,
                  padding: [3, 5]
             }
          },
          indicator:indicatorArrayFix
      },
      series: [{
          name: '座椅评测',
          type: 'radar',
          // areaStyle: {normal: {}},
          data : [
              {
                  value :valueArrayFix,
                  name : '座椅评测'
              }
          ]
      }]
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);

});
