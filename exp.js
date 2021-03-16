function foo() {
  console.log(111);
  bar()// ReferenceError: bar is not a function
}


window.foo = foo;

foo();
