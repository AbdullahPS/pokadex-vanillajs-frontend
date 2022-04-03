// When the user clicks on <span> (x), close the modal
export const closeModal = ()=> {
    modal.style.display = "none";
  }
  
  // When the user clicks anywhere outside of the modal, close it
  ewindow.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }