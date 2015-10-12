export default class ContainerNode {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }

    hasChild() {
        return this.left && this.right;
    }
}
