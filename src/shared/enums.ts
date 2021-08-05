export enum RelationType {
  // enables other flag
  Enables = 'enables',
  // changes value of other flag if it is not specified
  Changes = 'changes',
  // modifies some part of value, for example adds something to arrays
  Modifies = 'modifies',
  // needs in other flag enabled to work properly
  Needs = 'needs',
  // replace because other flag is deprecated
  Replaces = 'replaces',
  // just somehow related
  Related = 'related'
}
