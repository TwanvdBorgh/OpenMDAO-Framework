/* 
Copyright (c) 2010. All rights reserved.
LICENSE: NASA Open Source License
*/

var openmdao = (typeof openmdao == "undefined" || !openmdao ) ? {} : openmdao ; 

/**
 * 
 * @version 0.0.0
 * @constructor
 */
openmdao.PropertiesEditor = function(id,model) {
    
    /***********************************************************************
     *  private
     ***********************************************************************/
     
    if (arguments.length > 0)
        // initialize private variables
        var pathname,
            nameHeader,
            inputs,
            outputs,
            columns = [
                {id:"name",  name:"Name",  field:"name"},
                {id:"value", name:"Value", field:"value", editor:TextCellEditor},
            ],
            inputs_options = {
                editable: true,
                asyncEditorLoading: false,
                editOnDoubleClick: true,
                multiSelect: false,
                autoHeight: true,
                autoEdit: false,
                //enableAddRow: true,
            },
            outputs_options = {
                asyncEditorLoading: false,
                multiSelect: false,
                autoHeight: true,
                autoEdit: false,
            }
        // build it
        init()
    
    
    function init() {
        this.prototype = Object.create(openmdao.BasePane)
        this.prototype.init(id,"Properties Editor")
        
        debug.log(this.prototype)
        debug.log(this)
        
        nameHeader = jQuery("<h3>")

        var inputsHeader = jQuery("<h3>Inputs</h3>"),
            outputsHeader = jQuery("<h3>Outputs</h3>"),
            inputsDiv = jQuery("<div id='inputs'>"),
            outputsDiv = jQuery("<div id='outputs'>")

        // FIXME:  shouldn't have to specify this.prototype
        this.prototype.elm.append(nameHeader);
        this.prototype.elm.append('<p>')
        this.prototype.elm.append(inputsHeader)
        this.prototype.elm.append(inputsDiv)
        this.prototype.elm.append('<p>')
        this.prototype.elm.append(outputsHeader)
        this.prototype.elm.append(outputsDiv)

        inputs = new Slick.Grid(inputsDiv, [], columns, inputs_options)
        inputsHeader.click(function () {
            inputsDiv.toggle("normal")
            return false;
        });
        inputs.onCellChange.subscribe(function(e,args) {
            // TODO: better way to do this (e.g. model.setProperty(path,name,value)
            cmd = 'top.'+self.pathname+'.'+args.item.name+'='+args.item.value
            model.issueCommand(cmd)
        })
        
        outputs = new Slick.Grid(outputsDiv, [], columns, outputs_options)       
        outputsHeader.click(function () {
            outputsDiv.toggle("normal")
            return false;
        });
        
        model.addListener(update)
    }
          
    /** load the table with the given properties */
    function loadTables(properties) {
        if (properties['type']) {
            nameHeader.html(properties['type']+': '+pathname)
            inputs.setData(properties['inputs'])
            outputs.setData(properties['outputs'])
        }
        else {
            nameHeader.html(pathname)
            inputs.setData([])
            outputs.setData([])
            alert('Error getting properties for '+pathname)
        }
        inputs.updateRowCount()
        inputs.render()
        outputs.updateRowCount()
        outputs.render()
    }
    
    /** if there is an object loaded, update it from the model */
    function update() {
        if (self.pathname && self.pathname.length>0)
            self.editObject(self.pathname)
    }
    
    /***********************************************************************
     *  privileged
     ***********************************************************************/
    
    /** get the specified object from model, load properties into table */
    this.editObject = function(path) {
        if (self.pathname !== path)
            self.pathname = path
        model.getComponent(path, loadTables,
            function(jqXHR, textStatus, errorThrown) {
                self.pathname = ''
                alert("Error editing object: "+jqXHR.statusText)
                debug.error(jqXHR)
            }
        )
        return this
    }
    
}
