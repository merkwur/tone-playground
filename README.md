# Tone.JS Playground

Easy to develop synthesizer on a browser. Highly influenced by VCV Rack 


## How to Play

 - *Right-click on a canvas to open a menu*
 - *Left click on an element on the menu selects and creates the node from the element*
 - *In order to create a sound one must create a destination node. The destination node must be the last element in the tree. And must have a connection. A single connection is better than multiple connections. To handle the multiple connections use the gain node*
 - *All the right bottom squares are output the sockets*
 - *All the left side sockets are the inputs*
 - *Connections can only be created via dragging the mouse from output to any input -for now.- The line will appear after if the connection is valid.*
 - *There are minor and major multiple bugs that exist* 

## To-Do

 - There is an issue with the Transport. It should be easy to fix or need to create a new clock system. 
 - An Envelope component has missing functionality. On-graph value manipulation is pretty much in need. Later, animation of the value passing through the envelope.
 - Waveform and FFT visualizers. Waveform also should support the Lissajous curves.
 - Each node section needs to be redesigned according to easy-to-use UI/UX
 - Mobile support can be considerable. 
