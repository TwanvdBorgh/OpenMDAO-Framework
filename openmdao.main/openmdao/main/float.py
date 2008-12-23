"""
Float: a Variable wrapper for floats
"""

#public symbols
__all__ = ["Float"]

__version__ = "0.1"


from openmdao.main.variable import Variable
from openmdao.main.vartypemap import add_var_type_map
from openmdao.main.constraint import MinConstraint, MaxConstraint

_unassigned = object()

class Float(Variable):
    """A float Variable"""
    
    def __init__(self, name, parent, iostatus, ref_name=None, 
                 default=None, desc=None, units=_unassigned, 
                 min_limit=None, max_limit=None):
        self.units = units
        super(Float, self).__init__(name, parent, iostatus, 
                                    val_type=(float,int,long), 
                                    ref_name=ref_name, 
                                    default=default, desc=desc)
        if min_limit is not None:
            self.min_constraint = MinConstraint(min_limit)
            self.add_constraint(self.min_constraint)
        if max_limit is not None:
            self.max_constraint = MaxConstraint(max_limit)
            self.add_constraint(self.max_constraint)


    def _incompatible_units(self, variable, units):
        raise TypeError(variable.get_pathname()+' units ('+
                        units+') are '+
                        'incompatible with units ('+self.units+') of '+ 
                        self.get_pathname())
        
    def validate_var(self, var):
        """Raise a TypeError if the connecting Variable is incompatible. This
        is called on the INPUT side of a connection."""
        Variable.validate_var(self, var)
        
        if self.units is not _unassigned:
            # if units are defined, force exact unit match for now
            if var.units is not _unassigned and var.units != self.units: 
                self._incompatible_units(var, var.units)
                
            # allow value without units to be assigned to val with units

     
    def _convert(self, variable):
        """Perform unit conversion here. Validation is not necessary because 
        it's already been done in validate_var.
        """
        #TODO: add unit conversion code here...
        return variable.value
    
    
add_var_type_map(Float, float)
