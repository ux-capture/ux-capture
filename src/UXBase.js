/**
 * `UXBase` is a parent class that constructs a `this.props`
 * interface for all classes that extend it.
 *
 * This pattern permits subclasses to avoid needing
 * constructors only for property assignment.
 *
 * By itself, `UXBase` has no utility.
 *
 * @see: Zone.js, View.js
 */
export default class UXBase {
  constructor(props) {
    this.props = props;
  }
}
