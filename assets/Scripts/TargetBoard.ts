import { _decorator, CCFloat, CCInteger, Component, Node, randomRangeInt } from 'cc';
import { Target } from './Target';
import { PredefinedWaves, randomTime } from './Data';
const { ccclass, property } = _decorator;

export class WaveConfig
{
    possibleTargets: number[];    // Mask: 0b0000111100001111 or 0x00110011
    preDelay: number;
    baseTime: number;
    difficulty: number;
}

@ccclass('TargetBoard')
export class TargetBoard extends Component
{
    @property({ type:CCFloat })
    private waveDefaultDelay: number;
    @property({ type:CCInteger })
    private baseDifficulty: number;
    @property({ type:CCFloat })
    private baseWaveDelayDecrementRate: number;
    @property({ type:CCFloat })
    private baseWaveTimeDecrementRate: number;

    @property([Target])
    private targets: Target[] = [];

    private _targetGrid: Target[][] = [];
    
    private _waveDelay: number;
    private _waveTimeDecrement: number;
    private _waveCount: number;
    private _difficulty: number;
    private _thisWaveRandIndex: number;
    private _nextWaveRandIndex: number;

    private _waveDelayDrecementRate: number;
    private _waveTimeDecrementRate: number;

    private _thisWave: WaveConfig;
    private _nextWave: WaveConfig;
    private _thisWaveTargetMask: number;

    // Tracking flags
    private _preWaveDelaying: boolean;
    private _boardSprang: boolean;

	protected start(): void
	{
		this._targetGrid = [];
		for (let i = 0; i < 4; ++i)
		{
			this._targetGrid.push([]);
			for (let j = 0; j < 4; ++j)
			{
				this._targetGrid[i].push(this.targets[i * 4 + j]);
			}
        }
    }

    public activateBoard()
    {
        this._waveCount = 0;
        this._difficulty = this.baseDifficulty;
        this._waveDelay = this.waveDefaultDelay;
        this._waveTimeDecrement = 0;

        this._waveDelayDrecementRate = this.baseWaveDelayDecrementRate;
        this._waveTimeDecrementRate = this.baseWaveTimeDecrementRate;

        this._boardSprang = false;
        this._preWaveDelaying = false;

        this._thisWave = null;
        this._nextWave = this.getRandomWave();
        this.startNextWave();
    }

    public stopBoard()
    {
        this.endWaveHelper();
        this.unschedule(this.endWaveNormally);
    }

    public evaluateWaveCompletion()
    {
        for (let i = 0; i < this.targets.length; ++i)
        {
            if ((1 << i) & this._thisWaveTargetMask && !this.targets[i].isShot)
            {
                return false;
            }
        }

        // All shown targets are shot
        this.endWaveNormally();
    }

    public getTargetNodeBelow(target: Target): Target
    {
        let index = this.targets.findIndex((tar: Target) => {
            return tar.name == target.name;
        });

        if (index >= 0 || index <= 11)
        {
            return this.targets[index + 4];   
        }
        else
        {
            return null;
        }
    }

    private startNextWave()
    {
        // Wave assignments
        this._thisWave = this._nextWave;
        this._thisWaveRandIndex = this._nextWaveRandIndex;
        this._waveDelay -= this.getWaveDelayDecrement();
        this._waveTimeDecrement += this.getWaveTimeDecrement();

        this._nextWave = this.getRandomWave();

        // Scheduling
        this._preWaveDelaying = true;
        this.scheduleOnce(this.springTargetsOfWaves, this._thisWave.preDelay);
    }

    private endWaveNormally()
    {
        if (this._boardSprang)
        {
            this._waveCount += 1;

            this.endWaveHelper();

            console.log("Target downed");
            this.unschedule(this.endWaveNormally);
            this.startNextWave();
        }
    }
    
    private endWaveHelper()
    {
        for (let i = 0; i < this.targets.length; ++i)
        {
            if ((1 << i) & this._thisWaveTargetMask)
            {
                this.targets[i].lowerBoard();
            }
        }

        this._boardSprang = false;
    }

    private springTargetsOfWaves()
    {
        if (this._preWaveDelaying)
        {
            this._thisWaveTargetMask = this._thisWave.possibleTargets[this._thisWaveRandIndex];

            console.log("Target mask: " + this._thisWaveTargetMask.toString(16) + ", Wait time: " + this._thisWave.baseTime);

            for (let i = 0; i < this.targets.length; ++i)
            {
                if ((1 << i) & this._thisWaveTargetMask)
                {
                    this.targets[i].springBoard();
                }
            }

            this._preWaveDelaying = false;
            this._boardSprang = true;
            this.scheduleOnce(this.endWaveNormally, this._thisWave.baseTime);
        }
    }

    private getRandomWave(): WaveConfig
    {
        var keys = Object.keys(PredefinedWaves);
        var wave = { ...(PredefinedWaves[keys[Math.floor(Math.random() * keys.length)]]) };
        this._nextWaveRandIndex = randomRangeInt(0, wave.possibleTargets.length)

        wave.preDelay = this._waveDelay;
        wave.baseTime = Math.max((wave.baseTime < 0 ? randomTime[this._nextWaveRandIndex] : wave.baseTime) - - this._waveTimeDecrement, 0);
        return wave;
    }

    private getWaveDelayDecrement(): number
    {
        return 0;
    }
    
    private getWaveTimeDecrement(): number
    {
        return 0;
    }
}

