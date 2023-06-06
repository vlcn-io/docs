type RopeNode = {
  left: RopeNode | null;
  right: RopeNode | null;
  weight: number;
  content: undefined | string;
};

class RoperIterator implements Iterator<string> {
  #stack: RopeNode[] = [];

  constructor(root: RopeNode) {
    let c: RopeNode | null = root;
    while (c) {
      this.#stack.push(c);
      c = c.left;
    }
  }

  next(): IteratorResult<string> {
    let result = this.#stack.pop();

    if (this.#stack.length !== 0) {
      let parent = this.#stack.pop();
      let right = parent!.right;
      if (right != null) {
        this.#stack.push(right);
        let cleft = right.left;
        while (cleft != null) {
          this.#stack.push(cleft);
          cleft = cleft.left;
        }
      }
    }

    // @ts-ignore
    return {
      done: this.#stack.length == 0,
      value: result!,
    };
  }
}

// prolly rope?
// chunks size determined by hash?
// location determined by lengths?
