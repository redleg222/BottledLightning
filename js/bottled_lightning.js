const pageLoad = () => {
let pages = {};
    
    $("#begin").click(function(event) {
        $(this).css("display", "none");
        const $title_div = $("<div></div>")
                    .attr("id", "title_div")
                    .addClass("form-group");

        addPageButton($title_div);
        addHTMLButton($title_div);
        addTitle($title_div)

        $("#footer").before($title_div);
    });

    const addPage = (page_num, $div_before) => {
        $("#AMP_div").remove();
        const idPage = `page_${page_num.pad(2)}`;
        pages[idPage] = {id: idPage, number: page_num, layers: []};
        const $page_div = $("<div></div>")
                .attr("id", idPage)
                .addClass("page_div");

        addRemovePageButton(idPage, $page_div);
        addPageHeader(idPage, $page_div);
        addCollapseButton(`#${idPage}_layers`, "Page Layers", $page_div);
        addLayerButton(idPage, $page_div);
        addLayers(`${idPage}_layers`, $page_div)
        $div_before.before($page_div);
        addLayer(idPage);
    }

    const addLayer = (idPage) => {
        $("#AMP_div").remove();
        let objLayers = pages[idPage].layers;
        const iLayer = objLayers.length + 1
        const nameLayer = `Layer_${iLayer.pad(2)}`; 
        const idLayer = `${idPage}_layer_${iLayer.pad(2)}`; 
        pages[idPage].layers.push(idLayer)
        const $layer = $("<div></div>")
                .attr("id",`${idLayer}`)
                .attr("layer","");
        $(`#${idPage}_layers`).append($layer);

        addCollapseButton(`#${idLayer}_values`, nameLayer, $layer);
        addFormatInput($layer);
        addRadioInput("Header", idLayer, $layer);
        addRadioInput("Body", idLayer, $layer);
        addRadioInput("Image", idLayer, $layer);
        addRadioInput("Video", idLayer, $layer);
        addRemoveLayerButton(idPage, $layer)

        $(".header").click(function() {
            const $values = clearLayer($(this));
            $values.parent().attr("layer", "header")
            addTextInput("Header", $values);
            addTextInput("Sub-header", $values);
            addCheckInput("Bottom", $values);
        })

        $(".body").click(function() {
            const $values = clearLayer($(this));
            $values.parent().attr("layer", "body")
            addTextInput("Body", $values);
            addCheckInput("Bottom", $values);
        })

        $(".image").click(function() {
            const $values = clearLayer($(this));
            $values.parent().attr("layer", "image")
            addFileInput("Image", $values);
            addLayoutInput($values);
            addTextInput("Height", $values, "1280");
            addTextInput("Width", $values, "720");
        })

        $(".video").click(function() {
            const $values = clearLayer($(this));
            $values.parent().attr("layer", "video")
            addFileInput("Video", $values);
            addFileInput("Poster", $values);
            addLayoutInput($values);
            addTextInput("Height", $values, "1280");
            addTextInput("Width", $values, "720");
            addCheckInput("Autoplay", $values);
            addCheckInput("Loop", $values);
        })
    }

    const addTitle = ($obj) => {
        const $label = $("<h2></h2>")
                    .attr("for", "title")
                    .html("Story Title:");
        
        const $title = $("<input>")
                    .attr("id","title")
                    .attr("type","text")
                    .addClass("form-control");
        
        $obj.append($label);
        $obj.append($title);
    }
    
    const addPageButton = ($obj) => {
        const $button = $("<button></button>")
                    .attr("id","addPage")
                    .attr("type","button")
                    .addClass("btn btn-xs pull-right")
                    .click(function(event) {
                        addPage(page_count() + 1, $("#footer"));
                    })
                    .html("Add Page");
        
        $obj.append($button);
    }
    
    const addHTMLButton = ($obj) => {
        const $button = $("<button></button>")
                    .attr("id","addPage")
                    .attr("type","button")
                    .css("margin-right", "10px")
                    .addClass("btn btn-xs pull-right")
                    .click(function(event) {  
                        $("#AMP_div").remove();
                        const $amp_div = $("<div></div>")
                                 .attr("id","AMP_div")
                                 .addClass("form-group")
                                 .append(`<h2>AMP HTML:</h2>`)
                        const $amp_html = $("<textarea></textarea>")
                                 .attr("id","AMP_HTML")
                                 .attr("wrap","hard")
                                 .attr("rows","5")
                                 .addClass("form-control");
                                 
                        $amp_div.append($amp_html);
                            
                        $("#footer").before($amp_div);
                        $amp_html[0].value = buildStory();
                        $amp_html[0].select();
                        document.execCommand("copy");
                        setTimeout(function() { 
                            alert("AMP HTML was copied to your clipboard."); 
                        }, 100);
                    })
                    .html("Create AMP HTML");

        $obj.append($button);
    }
        
    const addPageHeader = (idPage, $obj) => {
        const $header = $("<h2></h2>")
                .html(camel(idPage));
        
        $obj.append($header);
    }

    const addCollapseButton = (id, name, $obj) => {
        const $button = $("<button></button>")
                            .attr("type","button")
                            .attr("data-toggle","collapse")
                            .attr("data-target",id)
                            .addClass("btn btn-info")
                            .html(name);
        
        $obj.append($button);
    } 
    
    const addLayerButton = (idPage, $obj) => {
        const $button = $("<button></button>")
                .attr("id","addLayer")
                .attr("type","button")
                .addClass("btn btn-xs pull-right")
                .click(function(event) {
                      addLayer(idPage);
                })
                .html("Add Layer");
        
        $obj.append($button);
    }
    
    const addLayers = (id, $obj) => {
        const $layers = $("<div></div>")
                            .attr("id",id)
                            .addClass("collapse in");  

        $obj.append($layers);
    }   
        
    const addRemovePageButton = (page, $obj) => {
        const $button = $("<button></button>")
                            .attr("type","button")
                            .attr("id","removeLayer")
                            .addClass("btn btn-xs pull-right btn-danger")
                            .click(function() {
                                let layer = $(this).parent().attr("id")  
                                pages: delete pages[page];
                                $(this).parent().remove();
                            })
                            .html("X");
        
        $obj.append($button);
    }
    
    const addRemoveLayerButton = (idPage, $obj) => {
        const $button = $("<button></button>")
                            .attr("type","button")
                            .attr("id","removeLayer")
                            .addClass("btn btn-xs pull-right btn-danger")
                            .click(function() {
                                let layer = $(this).parent().attr("id")  
                                pages[idPage].layers = pages[idPage].layers.filter(item => item !== layer)
                                $(this).parent().remove();
                            })
                            .html("X");
        
        $obj.append($button);
    }    
    
    const addFormatInput = ($obj) => {
        const $label = $("<label></label>")
                            .attr("for","Format")
                            .addClass("amp_ctrl_lbl")
                            .html("Format");
        const $input = $("<select></select>")
                            .attr("id","Format")
                            .addClass("form-control-inline amp_ctrl_format")
                            .html(`<option value="Fill">Fill</option>
                                   <option value="Vertical">Vertical</option>
                                   <option value="Horizontal">Horizontal</option>
                                   <option value="Thirds">Thirds</option>`);
        
        $obj.append($label);
        $obj.append($input);
    }    

    const addRadioInput = (label, name, $obj) => {
        const $label = $("<label></label>")
                            .addClass("radio-inline")
                            .html(`<input class="${label.toLowerCase()}" type="radio" name="${name}_radio">${label}`);

        $obj.append($label);
    }        

    const clearLayer = ($obj) => {
        let parent = `${$obj.parent().parent().attr("id")}`;
        let section = `${$obj.parent().parent().attr("id")}_values`;
        $(`#${section}`).remove();
        $values = $("<div></div>").attr("id",section)
            .addClass("collapse in");
        $(`#${parent}`).append($values);
        return $values;
    }
    
    const addTextInput = (label, $obj, default_value = "") => {
        const $label = $("<label></label>")
                            .attr("for",label)
                            .addClass("amp_ctrl_lbl")
                            .html(label);
        const $input = $("<input>")
                            .attr("id",label)
                            .attr("type","text")
                            .addClass("form-control");
        if (default_value.length > 0) {
            $input[0].value = default_value;
        }
        
        $obj.append($label);
        $obj.append($input);  
    }
    
    const addFileInput = (label, $obj) => {
        const $label = $("<label></label>")
                            .attr("for",label)
                            .addClass("amp_ctrl_lbl")
                            .html(label);
        const $input = $("<input>")
                            .attr("id",label.toLowerCase())
                            .attr("type","file")
                            .attr("path","")
                            .addClass("form-control-file")
                            .change(function () {
                                let filename = $(this).val()
                                    .replace(/\\/g, '/')
                                    .replace("C:/fakepath", "assets");
                                $(this).attr("path",filename);
                            })
        
        $obj.append($label);
        $obj.append($input); 
    }
    
    const addLayoutInput = ($obj) => {
        const $label = $("<label></label>")
                            .attr("for","Layout")
                            .addClass("amp_ctrl_lbl")
                            .html("Layout");
        const $input = $("<select></select>")
                            .attr("id","Layout")
                            .addClass("form-control amp_ctrl_layout")
                            .html(`<option value="Fill">Fill</option>
                                   <option value="Fixed">Fixed</option>
                                   <option value="Fixed-Height">Fixed-Height</option>
                                   <option value="Flex-Item">Flex-Item</option>
                                   <option value="Intrinsic">Intrinsic</option>
                                   <option value="Responsive" selected="true">Responsive</option>`);
        
        $obj.append($label);
        $obj.append($input);
    }    

    const addCheckInput = (label, $obj) => {
        const $label = $("<label></label>")
                            .attr("for",label)
                            .addClass("amp_ctrl_lbl")
                            .html(label);
        const $input = $("<input>")
                            .attr("id",label)
                            .attr("type","checkbox")
                            .attr("value", "")
                            .addClass("form-check-input big-checkbox");
        
        $obj.append($input);
        $obj.append($label);
    }

    Number.prototype.pad = function(size) {
        var s = String(this);
        while (s.length < (size || 2)) {s = "0" + s;}
        return s;
    }
    
    const camel = (s) => {
        const val = s.charAt(0).toUpperCase() + s.substr(1)
        return val;
    }
    
    const page_count = () => {
        return Object.keys(pages).length
    }

    const buildStory = () => {
        
        let head = createHead($("#title")[0].value);
        let body = 
`       <body>
            <amp-story standalone>`            

        $.each(pages, function( key, value ) {
            body +=
`
                <amp-story-page id="${value.id}">`            
            $.each(value.layers, function( key, value ) {
                switch ($(`#${value}`).attr("layer")) {
                    case "header":
                        body += addHeader(value);
                        break;
                    case "body":
                        body += addBody(value);
                        break;
                    case "image":
                        body += addImage(value);
                        break;
                    case "video":
                        body += addVideo(value);
                        break;
                    default:
                        console.log(0);
                }
            });

            body +=
`
                </amp-story-page>`               
        });
        
        body +=
`
            </amp-story>
        </body>`
        
        let story =
`<!doctype html>
<html ⚡>
    ${head}
    ${body}
</html>`

        return story;
    }
    
    const addHeader = (id) => {
        const template = $(`#${id}`).find("#Format").find("option:selected").text().toLowerCase();
        const header = $(`#${id}_values`).find("#Header")[0].value;
        const subheader = $(`#${id}_values`).find("#Sub-header")[0].value;
        let bottom = ""
        if ($(`#${id}`).find("#Bottom").is(":checked")) {
            bottom = ` class="bottom"`
        };     
        const html = 
`
                    <amp-story-grid-layer template="${template}"${bottom}>
                        <h1>${header}</h1>
                        <p>${subheader}</p>
                    </amp-story-grid-layer>`
        return html;
    }
    
    const addBody = (id) => {
        const template = $(`#${id}`).find("#Format").find("option:selected").text().toLowerCase();
        const body = $(`#${id}_values`).find("#Body")[0].value;
        let bottom = ""
        if ($(`#${id}`).find("#Bottom").is(":checked")) {
            bottom = ` class="bottom"`
        };     
        const html = 
`
                    <amp-story-grid-layer template="${template}"${bottom}>
                        <p>${body}</p>
                    </amp-story-grid-layer>`
        return html;
    }

    const addImage = (id) => {
        const template = $(`#${id}`).find("#Format").find("option:selected").text().toLowerCase();
        const path = $(`#${id}_values`).find("#image").attr("path");
        const h = $(`#${id}_values`).find("#Height")[0].value;
        const w = $(`#${id}_values`).find("#Width")[0].value;
        const layout = $(`#${id}`).find("#Layout").find("option:selected").text().toLowerCase();
        const html = 
`
                    <amp-story-grid-layer template="${template}">
                        <amp-img src="${path}"
                        width="${w}" height="${h}" 
                        layout="${layout}">
                        </amp-img>
                    </amp-story-grid-layer>`
        return html;
    }
    
    const addVideo = (id) => {
        const template = $(`#${id}`).find("#Format").find("option:selected").text().toLowerCase();
        const path = $(`#${id}_values`).find("#video").attr("path");
        const poster = $(`#${id}_values`).find("#poster").attr("path");
        const h = $(`#${id}_values`).find("#Height")[0].value;
        const w = $(`#${id}_values`).find("#Width")[0].value;
        const layout = $(`#${id}`).find("#Layout").find("option:selected").text().toLowerCase();
        let autoplay = ""
        if ($(`#${id}`).find("#Autoplay").is(":checked")) {
            autoplay = "autoplay"
        };        
        let loop = ""
        if ($(`#${id}`).find("#Loop").is(":checked")) {
            loop = "loop"
        };
        const html = 
`
                    <amp-story-grid-layer template="${template}">
                        <amp-video ${autoplay} ${loop}
                            width="${w}" height="${h}"
                            poster="${poster}"
                            layout="${layout}">
                            <source src="${path}" type="video/mp4">
                            <div fallback>
                                <p>This browser does not support the video element.</p>
                            </div>
                        </amp-video>
                    </amp-story-grid-layer>`
        return html;
    }

    const createHead = (title) => {
        const head =    
`   <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <link rel="icon" href="assets/favicon.ico">
        <link rel="canonical" href="index.html">
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
        <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <script async custom-element="amp-story"
            src="https://cdn.ampproject.org/v0/amp-story-0.1.js"></script>
        <script async custom-element="amp-viz-vega" src="https://cdn.ampproject.org/v0/amp-viz-vega-0.1.js"></script>
        <link href="https://fonts.googleapis.com/css?family=Oswald:200,300,400" rel="stylesheet">
        <style amp-custom>
            amp-story {
                font-family: Georgia;
                color: #fff;
            }
            amp-story-page {
                background-color: #000;
            }
            h1 {
                font-family: Georgia;
                font-weight: bold;
                font-style: italic;
                font-size: 2.875em;
                line-height: 1.174;
            }
            p {
                font-family: Arial;
                font-weight: normal;
                font-size: 1.3em;
                line-height: 1.5em;
                color: #fff;
            }
            q {
                font-weight: 300;
                font-size: 1.1em;
            }
            amp-story-grid-layer.bottom {
                align-content:end;
            }
            amp-story-grid-layer.noedge {
                padding: 0px;
            }
            amp-story-grid-layer.center-text {
                align-content: center;
            }
        </style>
    </head>`

        return head;
    }
}

