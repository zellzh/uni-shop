<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
page{
  width: 100%;
  height: 100%;
  
  image{
    vertical-align: bottom;
  }
  
  view{
    box-sizing: border-box;
  }
}
</style>
