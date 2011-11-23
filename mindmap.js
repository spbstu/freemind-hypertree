var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

function init(){

$.ajax("mindmap.xml", {
success: function(xml) {
    var json = $.xmlToJSON(xml, {
        decorator: function() {
          if(this.nodeName == "node")
	  {
            this.name = this["@TEXT"];
            this.id = this["@ID"];
            this.nodeName = "children";
	    this.data = { "link": this["@LINK"] };
	  }
        }
    }).children[0];

    //init Hypertree
    var ht = new $jit.Hypertree({
      //id of the visualization container
      injectInto: 'mindmap',
      //canvas width and height
      width: 600,
      height: 600,
      //Change node and edge styles such as
      //color, width and dimensions.
      Node: {
          dim: 8,
          color: "#e70"
      },
      Edge: {
          lineWidth: .6,
          color: "#b40"
      },

      onCreateLabel: function(domElement, node){
            domElement.innerHTML = node.name;
	/*
	    if(node.data.link && node.data.link.indexOf("http://") == 0)
	    {
		;//
	    }
	*/
            domElement.onclick = function(){
                ht.onClick(node.id);
            };
        },

      //Change node styles when labels are placed
      //or moved.
      onPlaceLabel: function(domElement, node){
          var style = domElement.style;
          style.display = '';
          style.cursor = 'pointer';
	  var depth = node._depth;

          if (depth <= 1) {
              style.color = "#ddd";
	  }

	  style.fontSize = (1.5/(depth + 1)) + "em";
	  style.color = "rgb(" + 
			(5-depth)*60 + "," +
			(5-depth)*60 + "," +
			(5-depth)*60 + ")";

	  if(node._depth >= 5)
	  {
              style.display = 'none';
          }

          var left = parseInt(style.left);
          var w = domElement.offsetWidth;
          style.left = (left - w / 2) + 'px';
      }
      
    });

    ht.loadJSON(json);
    ht.refresh();
}
});

}
