function init ( event ) {
	
	var spriteAnimator = new SpriteAnimator(this.material.map, 25, 1, 25, 25);
	player.allPlugins.sprite = spriteAnimator;
	
}