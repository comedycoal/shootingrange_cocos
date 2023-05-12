import { _decorator, bezier, Camera, CCFloat, clamp, Collider, Component, EventMouse, geometry, Input, input, inverseLerp, Node, PhysicsSystem, Slider, Sprite, tween, Tween, UITransform, Vec3, Widget } from 'cc';
import { PowerSlide, SlideConfig } from './PowerSlide';
import { TargetBoard } from './TargetBoard';
import { PredefinedGuns } from './Data';
import { Target } from './Target';
const { ccclass, property } = _decorator;

@ccclass('ReloadingSprite')
export class ReloadingSprite extends Component
{
	@property(Node)
	private bobNode: Node;
	@property(Node)
	private spinNode: Node;
	@property({type: CCFloat})
	private hideYPos: number;
	@property({type: CCFloat})
	private showYPos: number;
	@property({type: CCFloat})
	private spinCycle: number;
	@property({type: CCFloat})
	private bobCycle: number;
	@property({type: CCFloat})
	private bobLength: number;
	@property({type: CCFloat})
	private moveTime: number;

	private _spinTween: Tween<Node> = null;
	private _bobTween: Tween<Node> = null;
	private _moveTween: Tween<Node> = null;

	protected start(): void
	{
		this.node.position = new Vec3(this.node.position.x, this.hideYPos, this.node.position.z);

		this._spinTween = this.getSpinTween().start();
		this.bobNode.position = new Vec3(0, -this.bobLength / 2, 0);
		this._bobTween = this.getBobTween().start();
	}

	public show()
	{
		if (this._moveTween != null)
		{
			this._moveTween.stop();
		}

		this._moveTween = this.getMoveTween(true).start();
	}

	public hide()
	{
		if (this._moveTween != null)
		{
			this._moveTween.stop();
		}

		this._moveTween = this.getMoveTween(false).start();
	}

	private getMoveTween(isShow: boolean): Tween<Node>
	{
		return tween(this.node).to(this.moveTime, { position: new Vec3(this.node.position.x, isShow ? this.showYPos : this.hideYPos, this.node.position.z) },
			{
				// easing: this.customEase,
				easing: "quadInOut",
				onComplete: (t) => {
					this._moveTween = null;
					tween().stop()
				}
			});
	}

	private getSpinTween(): Tween<Node>
	{
		return tween(this.spinNode).by(this.spinCycle, { eulerAngles: new Vec3(0, 0, 360) },
			{
				easing: "linear",
			}).repeatForever();
	}

	private getBobTween(): Tween<Node>
	{
		let c1 = tween(this.bobNode).to(this.bobCycle, { position: new Vec3(0, this.bobLength / 2, 0) },
			{
				easing: "sineInOut",
			});
		
		let c2 = tween(this.bobNode).to(this.bobCycle, { position: new Vec3(0, -this.bobLength / 2, 0) },
			{
				easing: "sineInOut",
			});
		
		return tween(this.bobNode).sequence(c1, c2).repeatForever();
	}

	// private customEase(t: number): number
	// {
	// 	// return bezier(0.63, 0, 0.45, 1, t);
	// }
}