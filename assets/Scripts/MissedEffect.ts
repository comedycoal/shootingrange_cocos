import { _decorator, bezier, Camera, CCFloat, clamp, Collider, Component, EventMouse, geometry, Input, input, instantiate, inverseLerp, lerp, Node, PhysicsSystem, Quat, random, randomRange, Slider, Sprite, tween, Tween, UITransform, Vec2, Vec3, Widget } from 'cc';
import { PowerSlide, SlideConfig } from './PowerSlide';
import { TargetBoard } from './TargetBoard';
import { PredefinedGuns } from './Data';
import { Target } from './Target';
const { ccclass, property } = _decorator;

class BindTarget
{
	ratio: number;
}

class Bind
{
	scaleLogo1: Vec3
	scaleLogo2: Vec3
}

@ccclass('MissedEffect')
export class MissedEffect extends Component
{
	@property(Node)
	private doveBase: Node;
	@property({type:CCFloat})
	private flyDistX: number;
	@property({type:CCFloat})
	private flyDistY: number;
	@property({type:CCFloat})
	private effectTime: number;
	@property({type:CCFloat})
	private minAngle: number;
	@property({type:CCFloat})
	private maxAngle: number;

	protected start(): void
	{

	}

	public startEffect(count: number)
	{
		let bindTarget = new BindTarget();
		bindTarget.ratio = 0;

		let doves = [this.doveBase];
		let angles = [];

		for (let i = 0; i < count; ++i)
		{
			angles.push((i % 2 == 0 ? 1 : -1) * randomRange(this.minAngle, this.maxAngle));
		}

		this.doveBase.setRotationFromEuler(0, angles[0] < 0 ? 180 : 0, Math.abs(angles[0]));
		for (let i = 1; i < count; ++i)
		{
			let newDove = instantiate(this.doveBase);
			newDove.setParent(this.node);
			newDove.setPosition(this.doveBase.position);
			newDove.setRotationFromEuler(0, angles[i] < 0 ? 180 : 0, Math.abs(angles[i]));
			doves.push(newDove);
		}

		tween(bindTarget).to(this.effectTime, { ratio: 1 }, {
			easing: "quartOut",
			onUpdate: (target: BindTarget, ratio) =>
			{
				for (let i = 0; i < count; ++i)
				{ 
					doves[i].setPosition(this.getPositionOfTrajectory(angles[i], target.ratio));
				}
			},
			onComplete: (target) => {
				this.node.destroy();
			}
		}).start();
	}

	private getPositionOfTrajectory(r: number, t: number): Vec3
	{
		let x = lerp(0, this.flyDistX, t);
		let y = (this.flyDistY / 2) * Math.sin(Math.PI / this.flyDistX * x - Math.PI / 2) + this.flyDistY / 2;
		let vec = new Vec2(x, y);
		vec = vec.rotate(r * Math.PI / 180);

		return new Vec3(vec.x, vec.y, 0);
	}
}