export const innerText = `Right click on a window, opens a menu. 

Left click on an element on the menu, selects and creates a node from the element.

In order to create a sound one must create a destination node. And the destination node must be the last element in a tree. And must have an input. Single connection to the destination is better than multiple connections. To handling the multiple connections, use the gain node.

All the right bottom squares are the output sockets. And all the left side sockets are the input sockets. And connections can only be created via dragging the mouse from output to any input -for now.- The line will appear after if the connection is valid. That also means outputNode.connect(inputNode) => Tone.js operation

There are many bugs, both minor and major.

Happy noise making!`